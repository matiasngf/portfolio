# Vercel Fluid Logo

Particles arranged in a triangle shape that get displaced by a fluid simulation. Particles use a physics-based velocity system to flow with the fluid and gradually return to their original positions.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           page.tsx                                  │
│  - Scene component orchestrates everything                          │
│  - TrianglePoints component renders the particles                   │
│  - Leva UI for real-time parameter tweaking                         │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                   ┌───────────────┴───────────────┐
                   ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│        useFluid()             │   │    useParticleOffsets()       │
│        fluid-sim.tsx          │   │    use-particle-offsets.ts    │
│                               │   │                               │
│  Returns:                     │   │  Returns:                     │
│  - velocity.read.texture      │──▶│  - render(state, velocity)    │
│  - density.read.texture       │   │  - texture (RG=offset,BA=vel) │
│                               │   │  - uniforms                   │
└───────────────────────────────┘   └───────────────────────────────┘
                                                   │
                                                   ▼
                                   ┌───────────────────────────────┐
                                   │     Particle Material         │
                                   │     (RawShaderMaterial)       │
                                   │                               │
                                   │  Uses offset texture (RG) to  │
                                   │  displace particle positions  │
                                   └───────────────────────────────┘
```

## File Structure

```
src/app/
├── page.tsx                     # Main scene, particle geometry setup, Leva UI
├── fluid-sim.tsx                # Fluid simulation hook (useFluid)
└── programs/
    ├── particle-offsets/
    │   ├── particle-offsets.vert   # Fullscreen quad vertex shader
    │   ├── particle-offsets.frag   # Physics-based velocity + offset shader
    │   └── use-particle-offsets.ts # Hook managing double FBO + Leva controls
    ├── particles/
    │   ├── particles.vert          # Particle vertex shader (offset + transition)
    │   └── particles.frag          # Particle fragment shader (SDF channels)
    └── blob-post/
        ├── blob-post.vert          # Fullscreen quad vertex shader
        └── blob-post.frag          # Blob threshold post-processing
```

## Data Flow

### 1. Fluid Simulation (`fluid-sim.tsx`)

Mouse movement creates "splats" that inject velocity into the fluid. The simulation runs each frame and produces a velocity texture where RG channels contain XY velocity values.

Key outputs:

- `velocity.read.texture` - Current velocity field (sampled by particles)
- `density.read.texture` - Visual density (not used by particles)

### 2. Particle Offset System (`use-particle-offsets.ts`)

Uses a **double FBO** (ping-pong) to store per-particle state. Each pixel represents one particle:

- **RG channels**: Position offset from original location
- **BA channels**: Particle velocity (momentum)

**Physics Model (each frame in `particle-offsets.frag`):**

```glsl
// 1. Sample fluid velocity at particle's screen position
vec2 fluidVel = texture2D(uFluidVelocity, samplePos).xy;

// 2. Ignore tiny fluid movements (prevents constant drift)
if (length(fluidVel) < uMinVelocity) fluidVel = vec2(0.0);

// 3. Update particle velocity: add fluid influence + apply friction
vec2 newParticleVel = (prevParticleVel + fluidVel * uStrength) * uFriction;

// 4. Clamp to max velocity
if (length(newParticleVel) > MAX_VELOCITY) {
  newParticleVel = normalize(newParticleVel) * MAX_VELOCITY;
}

// 5. Update offset: apply velocity + return-to-origin force
vec2 newOffset = prevOffset + newParticleVel - prevOffset * uOffsetDecay;

// 6. Snap-to-origin when close and slow (prevents orbiting)
if (length(newOffset) < uSnapDistance && length(newParticleVel) < uSnapVelocityThreshold) {
  newOffset = mix(newOffset, vec2(0.0), uSnapLerpStrength);
  newParticleVel = vec2(0.0);
}

// Output: RG = offset, BA = particle velocity
gl_FragColor = vec4(newOffset, newParticleVel);
```

**Why physics-based instead of simple decay:**

- Simple `offset *= decay` pulls particles back too aggressively when far from origin
- Physics model accumulates momentum, creating natural movement
- Separate friction (velocity decay) and offsetDecay (return force) allow fine-tuning
- Snap behavior prevents particles from orbiting indefinitely

**Helper functions:**

- `createPositionsTexture(positions, textureSize)` - Creates a DataTexture storing original particle positions
- `createParticleUVs(count, textureSize)` - Generates UV coordinates mapping each particle to its pixel
- `computeTextureSize(count)` - Calculates power-of-2 texture size

### 3. Particle Rendering & Blob Effect

**Render Pipeline:**

```
Particles → particlesSdfFbo (AdditiveBlending, FloatType)
    │         RGB: R=outside triangle, G=inside triangle, B=mixed SDF
    ▼
BlobPostProcess → screenFbo
    │         step(threshold, B) creates blob cutoff
    ▼
FboDebug (displays screenFbo)
```

**Vertex shader (`particles.vert`):**

- Calculates `vTransitionFactor` from offset distance using `smoothstep(uTransitionStart, uTransitionStart + uTransitionDistance, offsetDistance)`
- Scales particle size: `uPointSize * (1.0 + vTransitionFactor)` (1x→2x when displaced)

**Fragment shader (`particles.frag`) output channels:**

- **R**: 1.0 if outside triangle SDF, 0.0 inside
- **G**: 1.0 if inside triangle SDF, 0.0 outside
- **B**: Mixed SDF based on `vTransitionFactor`:
  - When close to origin: outputs G (inside triangle = 1.0)
  - When displaced: circular gradient (2.0 at center → 0.0 at edge)

**Blob post-process (`blob-post.frag`):**

```glsl
float blobMask = step(uThreshold, blue);
if (blobMask < 0.5) discard;
gl_FragColor = vec4(1.0); // White output
```

Additive blending causes overlapping displaced particles to accumulate B values, creating metaball-like blob shapes when thresholded.

## SDF-Based Shape Rendering

Particles can sample a Signed Distance Function (SDF) to render a shape that spans across all particles. When particles are at their original positions, they form a perfect shape; when displaced, the shape appears to split apart.

### Concept

Instead of evaluating the SDF at the particle's center, we evaluate it **per-pixel within each particle**. This creates sharp edges that cut across particles.

### Implementation

**Vertex shader** passes original position and point size in world units:

```glsl
varying vec2 vOriginalPosition;
varying float vPointSizeWorld;

void main() {
  vOriginalPosition = position.xy;

  // Point size in world units (NDC is -1 to 1, so multiply by 2)
  vPointSizeWorld = uPointSize / uResolution.y * 2.0;

  // ... rest of vertex shader

}
```

**Fragment shader** calculates per-pixel world position:

```glsl
void main() {
  // gl_PointCoord.y is inverted (0 at top, 1 at bottom)
  vec2 pointCoordOffset = gl_PointCoord - vec2(0.5);
  pointCoordOffset.y = -pointCoordOffset.y;

  // Convert to world space offset
  // Key insight: aspect ratio corrections cancel out!
  // - Pixels→NDC uses different scales for X (width) and Y (height)
  // - NDC→World multiplies X by aspect (undoing vertex shader's division)
  // - Result: both X and Y use the same vPointSizeWorld factor
  vec2 worldOffset = pointCoordOffset * vPointSizeWorld;

  // Pixel's world position = particle's original position + offset
  vec2 pixelWorldPos = vOriginalPosition + worldOffset;

  // Evaluate SDF at this pixel's world position
  float sdf = sdEquilateralTriangle(pixelWorldPos, uTriangleRadius);

  // Color based on SDF
  vec3 color = sdf < 0.0 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
}
```

### Triangle SDF Function

```glsl
float sdEquilateralTriangle(vec2 p, float r) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}
```

The `r` parameter is the triangle's half-base width. For a triangle created with `createEquilateralTriangle(size)`, use `r = size * sqrt(3) / 3`.

### Common Pitfalls

1. **Y-axis inversion**: `gl_PointCoord.y` goes 0→1 from top→bottom. Must negate after centering.

2. **Aspect ratio handling**: Don't multiply worldOffset.x by aspect ratio. The conversions cancel out:
   - Point sprite is square in pixels
   - Pixel→NDC: divides by resolution (different for X and Y)
   - NDC→World: X gets multiplied by aspect (undoing vertex shader)
   - Net result: both axes use the same `vPointSizeWorld` scale

3. **Coordinate system mismatch**: Ensure the SDF uses the same coordinate system as your particle positions.

## Key Parameters

### Fluid (`useFluid`)

- `simRes` - Velocity simulation resolution (default: 128)
- `dyeRes` - Density resolution (default: 512)
- `velocityDissipation` - How fast velocity fades (default: 0.98)
- `curlStrength` - Vorticity/swirl amount (default: 20)

### Particle Physics (`useParticleOffsets`)

**Core physics (passed as options):**

| Parameter     | Default | Description                              |
| ------------- | ------- | ---------------------------------------- |
| `strength`    | 0.005   | Fluid velocity influence multiplier      |
| `friction`    | 0.98    | Particle velocity decay per frame (drag) |
| `offsetDecay` | 0.002   | Return-to-origin force strength          |

**Leva-controlled (runtime tweakable):**

| Parameter               | Default | Description                                |
| ----------------------- | ------- | ------------------------------------------ |
| `minVelocity`           | 0.0001  | Minimum fluid velocity to respond to       |
| `snapDistance`          | 0.01    | Distance threshold for snap-to-origin      |
| `snapVelocityThreshold` | 0.001   | Max particle velocity for snap to activate |
| `snapLerpStrength`      | 0.3     | Lerp strength when snapping to origin      |

**Shader constant:**

- `MAX_VELOCITY` = 0.03 - Clamps particle velocity to prevent excessive movement

### Particles (`TrianglePoints`)

- `spacing` - Distance between particles
- `size` - Point size (scales 1x→2x based on displacement)

### Blob Effect (Leva-controlled)

| Parameter            | Default | Description                                   |
| -------------------- | ------- | --------------------------------------------- |
| `transitionStart`    | 0.09    | Offset distance where transition begins       |
| `transitionDistance` | 0.05    | Range over which transition completes         |
| `blobThreshold`      | 1.0     | Cutoff for blob mask (higher = smaller blobs) |

## Debugging Tips

1. **Particles not moving:** Check that `velocityTexture` is being passed correctly and that the fluid simulation is running (move mouse to create splats)

2. **Particles moving but not returning:** Increase `offsetDecay` value (higher = stronger return force)

3. **Particles orbiting forever:** Adjust snap parameters - increase `snapDistance` and `snapVelocityThreshold`

4. **Particles too jittery:** Increase `minVelocity` to filter out noise from fluid sim

5. **Movement too fast/slow:** Adjust `strength` (fluid influence) and `friction` (momentum decay)

6. **Wrong particle positions:** Verify `particleUv` attribute is correctly computed and that `uPositions` texture contains correct world positions

7. **Visual artifacts:** Check texture filtering (should be `NearestFilter` for offset textures)

8. **Blob not forming:** Check `particlesSdfFbo` in FboDebug - blue channel should accumulate with additive blending. Increase particle size or decrease `blobThreshold`.

9. **Triangle not visible when stationary:** Ensure `transitionStart` > 0 so particles near origin output G channel (inside triangle) to B channel.

## Lib Utilities Used

From `@/lib/gl/`:

- `useDoubleFbo` - Ping-pong render targets
- `useRawShader` - Creates RawShaderMaterial with typed uniforms
- `useUniforms` - Memoized uniforms object
- `quadGeometry`, `quadCamera` - Fullscreen rendering primitives
- `saveGlState` - Saves/restores WebGL state for multi-pass rendering

From `leva`:

- `useControls` - Runtime parameter tweaking UI
- `folder` - Groups related controls
