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
    └── particles/
        ├── particles.vert          # Particle vertex shader (applies offset)
        └── particles.frag          # Particle fragment shader (circular shape)
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

### 3. Particle Rendering (`page.tsx`)

**Geometry attributes:**

- `position` - Original XYZ position of each particle
- `particleUv` - UV coordinate to sample from offset texture

**Vertex shader (`particles.vert`):**

```glsl
vec2 offset = texture2D(uOffsetTexture, particleUv).xy;
vec3 displaced = position + vec3(offset, 0.0);
// Direct clip space positioning with aspect correction
gl_Position = vec4(displaced.x / uScreenAspect, displaced.y, displaced.z, 1.0);
```

Particles are positioned directly in clip space (-1 to 1) without camera transforms. The `uScreenAspect` uniform corrects for screen aspect ratio.

**Fragment shader (`particles.frag`):**

- Renders circular points with soft edges using `gl_PointCoord`

## Key Parameters

### Fluid (`useFluid`)

- `simRes` - Velocity simulation resolution (default: 128)
- `dyeRes` - Density resolution (default: 512)
- `velocityDissipation` - How fast velocity fades (default: 0.98)
- `curlStrength` - Vorticity/swirl amount (default: 20)

### Particle Physics (`useParticleOffsets`)

**Core physics (passed as options):**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `strength` | 0.005 | Fluid velocity influence multiplier |
| `friction` | 0.98 | Particle velocity decay per frame (drag) |
| `offsetDecay` | 0.002 | Return-to-origin force strength |

**Leva-controlled (runtime tweakable):**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `minVelocity` | 0.0001 | Minimum fluid velocity to respond to |
| `snapDistance` | 0.01 | Distance threshold for snap-to-origin |
| `snapVelocityThreshold` | 0.001 | Max particle velocity for snap to activate |
| `snapLerpStrength` | 0.3 | Lerp strength when snapping to origin |

**Shader constant:**

- `MAX_VELOCITY` = 0.03 - Clamps particle velocity to prevent excessive movement

### Particles (`TrianglePoints`)

- `spacing` - Distance between particles
- `size` - Point size
- `color` - Particle color

## Debugging Tips

1. **Particles not moving:** Check that `velocityTexture` is being passed correctly and that the fluid simulation is running (move mouse to create splats)

2. **Particles moving but not returning:** Increase `offsetDecay` value (higher = stronger return force)

3. **Particles orbiting forever:** Adjust snap parameters - increase `snapDistance` and `snapVelocityThreshold`

4. **Particles too jittery:** Increase `minVelocity` to filter out noise from fluid sim

5. **Movement too fast/slow:** Adjust `strength` (fluid influence) and `friction` (momentum decay)

6. **Wrong particle positions:** Verify `particleUv` attribute is correctly computed and that `uPositions` texture contains correct world positions

7. **Visual artifacts:** Check texture filtering (should be `NearestFilter` for offset textures)

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
