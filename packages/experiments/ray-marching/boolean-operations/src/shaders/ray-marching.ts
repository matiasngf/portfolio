import {
  booleanFunctions,
  distanceFunctions,
  rayHit,
  transformations,
} from "./utils";

export const RayMarchingShader = {
  vertexShader: /* glsl */ `
	varying vec2 vUv;
	varying vec3 wPos;
	varying vec3 vPosition;

	void main() {
			vUv = uv;
			vPosition = position;
			wPos = (modelMatrix * vec4(position, 1.0)).xyz;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

  fragmentShader: /* glsl */ `
		uniform vec2 resolution;

		// custom uniforms
		uniform vec3 cPos;
		uniform vec4 cameraQuaternion;
		uniform float fov;

		varying vec2 vUv;
		varying vec3 wPos;
		varying vec3 vPosition;

		#define MAX_STEPS 300
		#define SURFACE_DIST 0.005
		#define MAX_DISTANCE 100.0

		${rayHit}
		${booleanFunctions}
		${distanceFunctions}
		${transformations}

		RayHit StairsSurface(vec3 p, int steps) {
			vec3 stairsColor = vec3(0.4, 0.4, 0.4);
			vec3 stepPos = p;
			vec3 stepSize = vec3(0.5, 1.0, 2.0);
			RayHit stairs = RayHit(
				sdCuboid(stepPos, stepSize),
				stairsColor
			);
			for (int i = 0; i < steps - 1; i++) {
				stepPos = Translate(stepPos, vec3(0.5, 0.5, 0.0));
				stairs = Union(stairs, RayHit(
					sdCuboid(stepPos, stepSize),
					stairsColor
				));
			}
			RayHit floor = RayHit(
				sdPlane(p, normalize(vec3(-1.0, 1.0, 0.0))),
				stairsColor * 0.5
			);
			// return Union(stairs, floor);
			return Difference(stairs, floor);
		}

		RayHit PacmanSurface(vec3 p) {
			vec3 pacmanColor = vec3(0.95, 0.95, 0.0);
			vec3 blackColor = vec3(0.1);
			vec3 pacmanPos = p;
			float pacmanSize = 1.0;
			RayHit sphereHit = RayHit(
				sdSphere(pacmanPos, pacmanSize),
				pacmanColor
			);
			vec3 mouthOrigin = pacmanPos;
			mouthOrigin = Translate(mouthOrigin, vec3(pacmanSize, 0.0, 0.0));
			mouthOrigin = Rotate(mouthOrigin, vec3(0.0, 0.0, -45.0));
			vec3 mouthSize = vec3(pacmanSize * 1.5, pacmanSize * 1.5, pacmanSize * 3.0);
			RayHit mouth = RayHit(
				sdCuboid(mouthOrigin, mouthSize),
				blackColor
			);
			RayHit pacman = Difference(sphereHit, mouth);
			return pacman;
		}

		RayHit OtherSurface(vec3 p) {
			RayHit sphere1 = RayHit(
				sdSphere(p, 0.5),
				vec3(1.0, 0.5, 0.5)
			);
			RayHit sphere2 = RayHit(
				sdSphere(Translate(p, vec3(0.5, 0.9, 0.0)), 0.5),
				vec3(0.5, 0.5, 1.0)
			);
			return SmoothMin(sphere1, sphere2, 0.5);
		}

		RayHit getSceneHit(vec3 p) {
			RayHit pacman = PacmanSurface(
					Rotate(
						Translate(p, vec3(0.0, 3.5, 0.0)),
						vec3(0.0, 0.0, -20.0)
					)
			);
			RayHit stairs = StairsSurface(
				Translate(p, vec3(-1.0, 0.0, 0.0)), 8
			);

			RayHit other = OtherSurface(
				Translate(p, vec3(2.5, 5.0, 0.0))
			);

			return Union(pacman, Union(stairs, other));

			return Union(pacman, stairs);
		}

		// ro: ray origin
		// rd: ray direction
		// ds: distrance to surface
		// d0: distance from origin
		vec3 rayMarch(vec3 ro, vec3 rd) {
			float d0 = 0.0;
			float minDist = MAX_DISTANCE;
			vec3 color = vec3(0.1, 0.1, 0.25);
			bool hit = false;
			for(int i = 0; i < MAX_STEPS; i++) {
				vec3 p = ro + d0 * rd;
				RayHit hitPoint = getSceneHit(p);
				float ds = hitPoint.dist;
				d0 += ds;
				if(ds < minDist) {
					minDist = ds;
				}
				if(ds < SURFACE_DIST) {
					color = hitPoint.color;
					hit = true;
					break;
				};
				if(d0 > MAX_DISTANCE) {
					break;
				}
			}
			if(!hit) {
				if(minDist < 0.05) {
					color = vec3(0.1, 0.1, 0.1);
				}
			}
			return color;
		}

		// https://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
		vec4 quat_from_axis_angle(vec3 axis, float angle) { 
			vec4 qr;
			float half_angle = (angle * 0.5) * 3.14159 / 180.0;
			qr.x = axis.x * sin(half_angle);
			qr.y = axis.y * sin(half_angle);
			qr.z = axis.z * sin(half_angle);
			qr.w = cos(half_angle);
			return qr;
		}

		vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle) { 
			vec4 q = quat_from_axis_angle(axis, angle);
			vec3 v = position.xyz;
			return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
		}

		vec3 quaterion_rotate(vec3 v, vec4 q) {
			return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
		}

		void main() {
			float aspectRatio = resolution.x / resolution.y;
			vec3 cameraOrigin = cPos;

			float fovMult = fov / 90.0;
			
			vec2 screenPos = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution;
			screenPos.x *= aspectRatio;
			screenPos *= fovMult;
			vec3 ray = vec3( screenPos.xy, -1.0 );
			ray = quaterion_rotate(ray, cameraQuaternion);
			ray = normalize( ray );

			vec3 color = rayMarch(cameraOrigin, ray);

			gl_FragColor = vec4(color, 1.0);
		}
    `,
};
