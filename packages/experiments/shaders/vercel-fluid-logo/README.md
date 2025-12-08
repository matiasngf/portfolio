# Vercel Fluid Logo

Particles arranged in a triangle shape that get displaced by a fluid simulation. Particles flow with the fluid velocity but gradually return to their original positions.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           page.tsx                                  │
│  - Scene component orchestrates everything                          │
│  - TrianglePoints component renders the particles                   │
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
│  - density.read.texture       │   │  - texture (offset texture)   │
│                               │   │  - uniforms                   │
└───────────────────────────────┘   └───────────────────────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │     Particle Material         │
                                    │     (RawShaderMaterial)       │
                                    │                               │
                                    │  Uses offset texture to       │
                                    │  displace particle positions  │
                                    └───────────────────────────────┘
```

## File Structure

```
src/app/
├── page.tsx                     # Main scene, particle geometry setup
├── fluid-sim.tsx                # Fluid simulation hook (useFluid)
└── programs/
    ├── particle-offsets/
    │   ├── particle-offsets.vert   # Fullscreen quad vertex shader
    │   ├── particle-offsets.frag   # Offset accumulation + decay shader
    │   └── use-particle-offsets.ts # Hook managing double FBO
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

Uses a **double FBO** (ping-pong) to store accumulated position offsets for each particle. Each pixel in the texture represents one particle's XY offset.

**Each frame:**

1. Sample previous offset from read buffer
2. Calculate screen position with aspect correction: `screenPos = (originalPos + offset) / vec2(aspect, 1.0)`
3. Sample velocity at particle's screen position (converted to UV space)
4. Accumulate: `newOffset = (prevOffset + velocity * strength) * decay`
5. Write to write buffer, then swap

**Helper functions:**

- `createPositionsTexture(positions, textureSize)` - Creates a DataTexture storing original particle positions (used to know where to sample velocity)
- `createParticleUVs(count, textureSize)` - Generates UV coordinates mapping each particle to its pixel in the offset texture
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

Particles are positioned directly in clip space (-1 to 1) without camera transforms. The `uScreenAspect` uniform corrects for screen aspect ratio to maintain the equilateral triangle shape.

**Fragment shader (`particles.frag`):**

- Renders circular points with soft edges using `gl_PointCoord`

## Key Parameters

### Fluid (`useFluid`)

- `simRes` - Velocity simulation resolution (default: 128)
- `dyeRes` - Density resolution (default: 512)
- `velocityDissipation` - How fast velocity fades (default: 0.98)
- `curlStrength` - Vorticity/swirl amount (default: 20)

### Particle Offsets (`useParticleOffsets`)

- `textureSize` - Must fit all particles (power of 2)
- `decay` - Return-to-origin speed (0.96 = slow return, 0.8 = fast)
- `strength` - Velocity influence multiplier
- `uScreenAspect` - Screen aspect ratio (width/height), updated each frame for correct velocity sampling

### Particles (`TrianglePoints`)

- `spacing` - Distance between particles
- `size` - Point size
- `color` - Particle color

## Debugging Tips

1. **Particles not moving:** Check that `velocityTexture` is being passed correctly and that the fluid simulation is running (move mouse to create splats)

2. **Particles moving but not returning:** Check `decay` value in `useParticleOffsets` - should be < 1.0

3. **Wrong particle positions:** Verify `particleUv` attribute is correctly computed and that `uPositions` texture contains correct world positions

4. **Visual artifacts:** Check texture filtering (should be `NearestFilter` for offset textures)

## Lib Utilities Used

From `@/lib/gl/`:

- `useDoubleFbo` - Ping-pong render targets
- `useRawShader` - Creates RawShaderMaterial with typed uniforms
- `useUniforms` - Memoized uniforms object
- `quadGeometry`, `quadCamera` - Fullscreen rendering primitives
- `saveGlState` - Saves/restores WebGL state for multi-pass rendering
