import { useMemo } from "react";
import * as THREE from "three";

/**
 * Creates a memoized uniforms object for Three.js shaders.
 *
 * - Object: uniforms are updated automatically on each render.
 * - Function: uniforms are not updated; manually update `.value` properties.
 *
 * @param uniforms - Uniforms object or factory function.
 *
 * @example
 * // Object: auto-updates on render
 * const uniforms = useUniforms({
 *   time: { value: 0 },
 *   color: { value: [0, 1, 0] },
 * });
 *
 * @example
 * // Function: manual updates required
 * const uniforms = useUniforms(() => ({
 *   time: { value: 0 },
 *   color: { value: new THREE.Vector3(1, 0, 0) },
 * }));
 * useFrame(() => {
 *   uniforms.time.value += 0.01;
 *   uniforms.color.value.set(1, 0, 0);
 * });
 */

export function useUniforms<T extends Record<string, THREE.IUniform>>(
  uniforms: T | (() => T)
) {
  const u = useMemo<T>(
    () => (typeof uniforms === "function" ? uniforms() : uniforms),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // On every re-render, update the uniforms values if uniforms is an object
  // (We assume users will use a function if reactive values are needed.)

  // If uniforms is a function, compute new values and update the `.value` on each uniform key.
  if (typeof uniforms === "object") {
    for (const key in uniforms) {
      if (Object.prototype.hasOwnProperty.call(u, key)) {
        // Update the value in the memoized uniforms object
        u[key].value = uniforms[key].value;
      }
    }
  }

  return u;
}
