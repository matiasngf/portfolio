"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

interface Splat {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const baseVertex = /* glsl */ `
  precision highp float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = uv;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(position, 0, 1);
  }
`;

const clearShader = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const splatShader = /* glsl */ `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const advectionShader = /* glsl */ `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
    gl_FragColor.a = 1.0;
  }
`;

const divergenceShader = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const curlShader = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const vorticityShader = /* glsl */ `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
  }
`;

const pressureShader = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float C = texture2D(uPressure, vUv).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShader = /* glsl */ `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const displayShader = /* glsl */ `
  precision highp float;
  uniform sampler2D tFluid;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec3 fluid = texture2D(tFluid, vUv).rgb;
    vec2 uv = vUv - fluid.rg * 0.0002;
    gl_FragColor = vec4(fluid * 0.1 + 0.5, 1.0);
  }
`;

function createDoubleFBO(
  width: number,
  height: number,
  options: {
    type?: THREE.TextureDataType;
    format?: THREE.PixelFormat;
    internalFormat?: number;
    minFilter?: THREE.MinificationTextureFilter;
    magFilter?: THREE.MagnificationTextureFilter;
  } = {},
) {
  const {
    type = THREE.HalfFloatType,
    format = THREE.RGBAFormat,
    minFilter = THREE.LinearFilter,
    magFilter = THREE.LinearFilter,
  } = options;

  const read = new THREE.WebGLRenderTarget(width, height, {
    type,
    format,
    minFilter,
    magFilter,
    generateMipmaps: false,
  });

  const write = new THREE.WebGLRenderTarget(width, height, {
    type,
    format,
    minFilter,
    magFilter,
    generateMipmaps: false,
  });

  const fbo = {
    read,
    write,
    swap: () => {
      const temp = fbo.read;
      fbo.read = fbo.write;
      fbo.write = temp;
    },
  };

  return fbo;
}

export function createQuadGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);
  const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

  const positionAttribute = new THREE.BufferAttribute(positions, 2);
  positionAttribute.setUsage(THREE.StaticDrawUsage);
  geometry.setAttribute("position", positionAttribute);

  const uvAttribute = new THREE.BufferAttribute(uvs, 2);
  uvAttribute.setUsage(THREE.StaticDrawUsage);
  geometry.setAttribute("uv", uvAttribute);

  // Manually set bounding sphere to avoid NaN errors
  // The triangle covers from -1 to 3 in both dimensions
  geometry.boundingSphere = new THREE.Sphere(
    new THREE.Vector3(1, 1, 0),
    Math.sqrt(8),
  );

  return geometry;
}

export function useFluid({
  simRes = 128 * 2,
  dyeRes = 512 * 2,
  iterations = 3,
  densityDissipation = 0.97,
  velocityDissipation = 0.98,
  pressureDissipation = 0.8,
  curlStrength = 20,
  radius = 0.2,
} = {}) {
  const { gl, size } = useThree();
  const quadGeometry = useMemo(() => createQuadGeometry(), []);

  // Create render targets
  const { density, velocity, pressure, divergence, curl } = useMemo(() => {
    // Use RGBA formats for better compatibility
    const densityFBO = createDoubleFBO(dyeRes, dyeRes, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
    });

    // Use RGBA for velocity but only use RG channels
    const velocityFBO = createDoubleFBO(simRes, simRes, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
    });

    // Use RGBA for pressure but only use R channel
    const pressureFBO = createDoubleFBO(simRes, simRes, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,

      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    });

    const divergenceRT = new THREE.WebGLRenderTarget(simRes, simRes, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,

      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      generateMipmaps: false,
    });

    const curlRT = new THREE.WebGLRenderTarget(simRes, simRes, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,

      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      generateMipmaps: false,
    });

    return {
      density: densityFBO,
      velocity: velocityFBO,
      pressure: pressureFBO,
      divergence: divergenceRT,
      curl: curlRT,
    };
  }, [dyeRes, simRes]);

  // Create shader materials
  const clearMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: clearShader,
        uniforms: {
          texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
          uTexture: { value: null },
          value: { value: pressureDissipation },
        },
        depthTest: false,
        depthWrite: false,
      }),
    [pressureDissipation, simRes],
  );

  const splatMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: splatShader,
        uniforms: {
          texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
          uTarget: { value: null },
          aspectRatio: { value: 1 },
          color: { value: new THREE.Vector3() },
          point: { value: new THREE.Vector2() },
          radius: { value: radius / 100 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    [simRes, radius],
  );

  const advectionMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: advectionShader,
        uniforms: {
          texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
          dyeTexelSize: { value: new THREE.Vector2(1 / dyeRes, 1 / dyeRes) },
          uVelocity: { value: null },
          uSource: { value: null },
          dt: { value: 0.016 },
          dissipation: { value: 1 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    [simRes, dyeRes],
  );

  const divergenceMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: divergenceShader,
        uniforms: {
          texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
          uVelocity: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    [simRes],
  );

  const curlMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: curlShader,
        uniforms: {
          texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
          uVelocity: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    [simRes],
  );

  const vorticityMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: vorticityShader,
        uniforms: {
          texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
          uVelocity: { value: null },
          uCurl: { value: null },
          curl: { value: curlStrength },
          dt: { value: 0.016 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    [simRes, curlStrength],
  );

  const pressureMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: pressureShader,
        uniforms: {
          texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
          uPressure: { value: null },
          uDivergence: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    [simRes],
  );

  const gradientSubtractMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: gradientSubtractShader,
        uniforms: {
          texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
          uPressure: { value: null },
          uVelocity: { value: null },
        },
        depthTest: false,
        depthWrite: false,
      }),
    [simRes],
  );

  const displayMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: displayShader,
        uniforms: {
          tFluid: { value: null },
          uTime: { value: 0 },
        },
      }),
    [],
  );

  // Create meshes for rendering
  const clearMesh = useMemo(
    () => new THREE.Mesh(quadGeometry, clearMaterial),
    [quadGeometry, clearMaterial],
  );
  const splatMesh = useMemo(
    () => new THREE.Mesh(quadGeometry, splatMaterial),
    [quadGeometry, splatMaterial],
  );
  const advectionMesh = useMemo(
    () => new THREE.Mesh(quadGeometry, advectionMaterial),
    [quadGeometry, advectionMaterial],
  );
  const divergenceMesh = useMemo(
    () => new THREE.Mesh(quadGeometry, divergenceMaterial),
    [quadGeometry, divergenceMaterial],
  );
  const curlMesh = useMemo(
    () => new THREE.Mesh(quadGeometry, curlMaterial),
    [quadGeometry, curlMaterial],
  );
  const vorticityMesh = useMemo(
    () => new THREE.Mesh(quadGeometry, vorticityMaterial),
    [quadGeometry, vorticityMaterial],
  );
  const pressureMesh = useMemo(
    () => new THREE.Mesh(quadGeometry, pressureMaterial),
    [quadGeometry, pressureMaterial],
  );
  const gradientSubtractMesh = useMemo(
    () => new THREE.Mesh(quadGeometry, gradientSubtractMaterial),
    [quadGeometry, gradientSubtractMaterial],
  );

  // Mouse/touch input handling
  const splatsRef = useRef<Splat[]>([]);
  const lastMouseRef = useRef<{ x: number; y: number; isInit: boolean }>({
    x: 0,
    y: 0,
    isInit: false,
  });

  useEffect(() => {
    function updateMouse(e: MouseEvent | TouchEvent) {
      let x: number, y: number;

      if ("changedTouches" in e && e.changedTouches.length) {
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
      } else if ("pageX" in e) {
        x = e.pageX;
        y = e.pageY;
      } else {
        return;
      }

      const lastMouse = lastMouseRef.current;

      if (!lastMouse.isInit) {
        lastMouse.isInit = true;
        lastMouse.x = x;
        lastMouse.y = y;
        return;
      }

      const deltaX = x - lastMouse.x;
      const deltaY = y - lastMouse.y;

      lastMouse.x = x;
      lastMouse.y = y;

      if (Math.abs(deltaX) || Math.abs(deltaY)) {
        splatsRef.current.push({
          x: x / size.width,
          y: 1 - y / size.height,
          dx: deltaX * 5,
          dy: deltaY * -5,
        });
      }
    }

    const isTouchCapable = "ontouchstart" in window;
    if (isTouchCapable) {
      window.addEventListener("touchstart", updateMouse);
      window.addEventListener("touchmove", updateMouse);
    } else {
      window.addEventListener("mousemove", updateMouse);
    }

    return () => {
      if (isTouchCapable) {
        window.removeEventListener("touchstart", updateMouse);
        window.removeEventListener("touchmove", updateMouse);
      } else {
        window.removeEventListener("mousemove", updateMouse);
      }
    };
  }, [size.width, size.height]);

  // Create camera for rendering
  const camera = useMemo(
    () => new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 2),
    [],
  );

  // Simulation loop
  useFrame((state) => {
    const currentSplats = [...splatsRef.current];
    splatsRef.current = [];

    // Render splats
    for (const splat of currentSplats) {
      splatMaterial.uniforms.uTarget.value = velocity.read.texture;
      splatMaterial.uniforms.aspectRatio.value = size.width / size.height;
      splatMaterial.uniforms.point.value.set(splat.x, splat.y);
      splatMaterial.uniforms.color.value.set(splat.dx, splat.dy, 1);

      gl.setRenderTarget(velocity.write);
      gl.render(splatMesh, camera);
      velocity.swap();

      splatMaterial.uniforms.uTarget.value = density.read.texture;
      gl.setRenderTarget(density.write);
      gl.render(splatMesh, camera);
      density.swap();
    }

    // Curl
    curlMaterial.uniforms.uVelocity.value = velocity.read.texture;
    gl.setRenderTarget(curl);
    gl.render(curlMesh, camera);

    // Vorticity
    vorticityMaterial.uniforms.uVelocity.value = velocity.read.texture;
    vorticityMaterial.uniforms.uCurl.value = curl.texture;
    gl.setRenderTarget(velocity.write);
    gl.render(vorticityMesh, camera);
    velocity.swap();

    // Divergence
    divergenceMaterial.uniforms.uVelocity.value = velocity.read.texture;
    gl.setRenderTarget(divergence);
    gl.render(divergenceMesh, camera);

    // Clear pressure
    clearMaterial.uniforms.uTexture.value = pressure.read.texture;
    gl.setRenderTarget(pressure.write);
    gl.render(clearMesh, camera);
    pressure.swap();

    // Pressure iteration
    pressureMaterial.uniforms.uDivergence.value = divergence.texture;
    for (let i = 0; i < iterations; i++) {
      pressureMaterial.uniforms.uPressure.value = pressure.read.texture;
      gl.setRenderTarget(pressure.write);
      gl.render(pressureMesh, camera);
      pressure.swap();
    }

    // Gradient subtract
    gradientSubtractMaterial.uniforms.uPressure.value = pressure.read.texture;
    gradientSubtractMaterial.uniforms.uVelocity.value = velocity.read.texture;
    gl.setRenderTarget(velocity.write);
    gl.render(gradientSubtractMesh, camera);
    velocity.swap();

    // Advect velocity
    advectionMaterial.uniforms.dyeTexelSize.value.set(1 / simRes, 1 / simRes);
    advectionMaterial.uniforms.uVelocity.value = velocity.read.texture;
    advectionMaterial.uniforms.uSource.value = velocity.read.texture;
    advectionMaterial.uniforms.dissipation.value = velocityDissipation;
    gl.setRenderTarget(velocity.write);
    gl.render(advectionMesh, camera);
    velocity.swap();

    // Advect density
    advectionMaterial.uniforms.dyeTexelSize.value.set(1 / dyeRes, 1 / dyeRes);
    advectionMaterial.uniforms.uVelocity.value = velocity.read.texture;
    advectionMaterial.uniforms.uSource.value = density.read.texture;
    advectionMaterial.uniforms.dissipation.value = densityDissipation;
    gl.setRenderTarget(density.write);
    gl.render(advectionMesh, camera);
    density.swap();

    // Update display
    displayMaterial.uniforms.tFluid.value = density.read.texture;
    displayMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    gl.setRenderTarget(null);
  });

  return {
    density,
    velocity,
  };
}
