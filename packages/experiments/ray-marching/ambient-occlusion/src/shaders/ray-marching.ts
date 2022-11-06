import { booleanFunctions } from "./boolean-functions";
import { castRay } from "./cast-ray";
import { getAmbientOcclusion } from "./get-ambient-occlusion";
import { getShadowHit } from "./get-shadow-hit";
import { rotate } from "./rotate";
import { getSceneHit } from "./scene";
import { shaderObjects } from "./shader-objects";
import { distanceFunctions, getLight, getNormal, structs, transformations, valueRemap } from "./utils";

export const RayMarchingShader = {

	vertexShader: /* glsl */`
	varying vec2 vUv;
	varying vec3 wPos;
	varying vec3 vPosition;

	void main() {
			vUv = uv;
			vPosition = position;
			wPos = (modelMatrix * vec4(position, 1.0)).xyz;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		uniform vec2 resolution;

		// custom uniforms
		uniform vec3 cPos;
		uniform vec4 cameraQuaternion;
		uniform float fov;
		uniform sampler2D hdriMap;
		uniform float uTime;

		varying vec2 vUv;
		varying vec3 wPos;
		varying vec3 vPosition;

		#define MAX_BOUNCES 5
		#define MAX_STEPS 300
		#define SURFACE_DIST 0.005
		#define MAX_DISTANCE 100.0

		#define REFLECTION_MAX_STEPS 300
		#define REFLECTION_SURFACE_DIST 0.01
		#define REFLECTION_MAX_DISTANCE 50.0

		// Todo: make uniforms
		const vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
		const vec3 lightColor = vec3(1.0, 1.0, 1.0);

		#define PI 3.14159265359

		${structs}
		${rotate}
		${valueRemap}
		${transformations}
		${distanceFunctions}
		${booleanFunctions}
		${shaderObjects}


		${getSceneHit}
		${getNormal}
		${getLight}
		${castRay}
		${getShadowHit}
		${getAmbientOcclusion}

		vec2 normalToUv(vec3 n) {
			float u = atan(n.x, n.z) / (2.0 * PI) + 0.5;
			float v = n.y * 0.5 + 0.5;
			return vec2(u, v);
		}

		vec3 getBackgroundColor(vec3 normal) {
			vec2 uv = normalToUv(normal);
			return texture2D(hdriMap, uv).rgb;
		}

		// returns a color for the given ray
		vec3 rayMarch(vec3 ro, vec3 rd) {
			vec3 rayPosition = ro;
			vec3 rayDirection = rd;
			vec3 result = vec3(0.0);

			RayLightResult lightResults[MAX_BOUNCES];

			bool finishedRay = false;

			for(int i = 0; i < MAX_BOUNCES; i++) {
				if(finishedRay) {
					lightResults[i] = RayLightResult(vec3(1.0), 1.0);
					break;
				}
				RayConfig rayConfig;
				// First ray with max quality, then reflections with lower quality
				if(i == 0) {
					rayConfig = RayConfig(
						MAX_DISTANCE,
						SURFACE_DIST,
						MAX_STEPS
					);
				} else {
					rayConfig = RayConfig(
						REFLECTION_MAX_DISTANCE,
						REFLECTION_SURFACE_DIST,
						REFLECTION_MAX_STEPS
					);
				}
				RayResult hit = castRay(
					rayPosition,
					rayDirection,
					rayConfig.maxDistance,
					rayConfig.surfaceDistance,
					rayConfig.maxSteps
				);
				if(hit.hit) {
					LightResult objectLight = getLight(hit.position, rayDirection, hit.rayHit);
					float objectAO = getAmbientOcclusion(hit.position, objectLight.normal);
					float objectShadow = getShadowHit(hit.position, objectLight.normal, rayConfig);
					lightResults[i] = RayLightResult(objectLight.color * objectShadow * objectAO, objectLight.reflectFactor);
					if(objectLight.reflectFactor < 0.05) {
						finishedRay = true;
					} else {
						rayDirection = reflect(rayDirection, objectLight.normal);
						rayPosition = hit.position + (rayDirection * REFLECTION_SURFACE_DIST * 20.0);
					}

				} else {
					lightResults[i] = RayLightResult(getBackgroundColor(rayDirection), 0.0);
					finishedRay = true;
				}
			}

			// combine all light results
			for(int i = 0; i < MAX_BOUNCES; i++) {
				int index = MAX_BOUNCES - i - 1;
				result = mix(lightResults[index].color, result, lightResults[index].reflectFactor);
			}

			return result;
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
    `

};