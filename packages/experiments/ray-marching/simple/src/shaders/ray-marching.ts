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

		varying vec2 vUv;
		varying vec3 wPos;
		varying vec3 vPosition;

		#define MAX_STEPS 200
		#define SURFACE_DIST 0.01
		#define MAX_DISTANCE 100.0

		float getDistance(vec3 p) {

			vec4 sphere = vec4(0.0, 2.0, -15.0, 2.0);
			float dist_to_sphere = length(p - sphere.xyz) - sphere.w;

			vec4 sphere2 = vec4(3.0, 4.0, -20.0, 1.5);
			float dist_to_sphere2 = length(p - sphere2.xyz) - sphere2.w;

			float dist_to_plane = p.y;

			float d = min(dist_to_sphere, dist_to_plane);
			d = min(d, dist_to_sphere2);
			return d;
		}

		// ro: ray origin
		// rd: ray direction
		// ds: distrance to surface
		// d0: distance from origin
		float rayMarch(vec3 ro, vec3 rd) {
			float d0 = 0.0;
			for(int i = 0; i < MAX_STEPS; i++) {
				vec3 p = ro + d0 * rd;
				float ds = getDistance(p);
				d0 += ds;
				if(ds < SURFACE_DIST || d0 > MAX_DISTANCE) break;
			}
			return clamp(d0, 0.0, MAX_DISTANCE);
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

			float d = rayMarch(cameraOrigin, ray);
			float normal_d = d / MAX_DISTANCE;

			gl_FragColor = vec4(vec3(normal_d), 1.0);
		}
    `

};