import { Vector2 } from "three";

/**
 * Checks if a point is inside a triangle using barycentric coordinates.
 */
function isPointInTriangle(
  p: Vector2,
  v0: Vector2,
  v1: Vector2,
  v2: Vector2,
): boolean {
  const d00 = v0.clone().sub(p);
  const d01 = v1.clone().sub(p);
  const d02 = v2.clone().sub(p);

  const area = Math.abs(
    (v1.x - v0.x) * (v2.y - v0.y) - (v2.x - v0.x) * (v1.y - v0.y),
  );

  const area0 = Math.abs(d01.x * d02.y - d02.x * d01.y);
  const area1 = Math.abs(d00.x * d02.y - d02.x * d00.y);
  const area2 = Math.abs(d00.x * d01.y - d01.x * d00.y);

  // Allow small epsilon for floating point errors
  const epsilon = 1e-10;
  return Math.abs(area0 + area1 + area2 - area) < epsilon;
}

/**
 * Generates points that fill the interior of a 2D triangle.
 *
 * @param vertices - Array of three Vector2 points defining the triangle vertices
 * @param spacing - Distance between points in the grid
 * @returns Float32Array with x, y, z coordinates (z = 0 for 2D)
 */
export function generateTrianglePoints(
  vertices: [Vector2, Vector2, Vector2],
  spacing: number,
): Float32Array {
  const [v0, v1, v2] = vertices;

  // Calculate bounding box
  const minX = Math.min(v0.x, v1.x, v2.x);
  const maxX = Math.max(v0.x, v1.x, v2.x);
  const minY = Math.min(v0.y, v1.y, v2.y);
  const maxY = Math.max(v0.y, v1.y, v2.y);

  // Validate spacing
  if (spacing <= 0) {
    throw new Error("Spacing must be a positive number");
  }

  // Check for degenerate triangle (zero area)
  const area = Math.abs(
    (v1.x - v0.x) * (v2.y - v0.y) - (v2.x - v0.x) * (v1.y - v0.y),
  );
  if (area < 1e-10) {
    return new Float32Array(0);
  }

  const points: number[] = [];
  const testPoint = new Vector2();

  // Generate grid points and filter those inside the triangle
  for (let x = minX; x <= maxX; x += spacing) {
    for (let y = minY; y <= maxY; y += spacing) {
      testPoint.set(x, y);
      if (isPointInTriangle(testPoint, v0, v1, v2)) {
        // Add small random z offset to prevent z-fighting
        const z = Math.random() * 0.9;
        points.push(x, y, z);
      }
    }
  }

  return new Float32Array(points);
}

/**
 * Creates an equilateral triangle centered at origin with given size.
 *
 * @param size - The height of the triangle from base to top
 * @returns Array of three Vector2 vertices
 */
export function createEquilateralTriangle(
  size: number = 2,
): [Vector2, Vector2, Vector2] {
  const height = size;
  const halfBase = (height * Math.sqrt(3)) / 3;

  // Centered at origin
  return [
    new Vector2(0, (height * 2) / 3), // top vertex
    new Vector2(-halfBase, -height / 3), // bottom left
    new Vector2(halfBase, -height / 3), // bottom right
  ];
}
