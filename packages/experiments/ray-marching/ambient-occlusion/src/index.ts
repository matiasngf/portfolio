import {
  WebGLRenderer,
  Scene,
  Vector2,
  Vector3,
  GridHelper,
  Quaternion,
  TextureLoader,
  PerspectiveCamera,
} from "../node_modules/three";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "../node_modules/three/examples/jsm/postprocessing/ShaderPass";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { RayMarchingShader } from "./shaders/ray-marching";
import backgroundMapUrl from "./textures/goegap_4k-min.jpg";

export const start = () => {
  let isRunning = true;

  const getDeviceSize = () => {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio;
    return {
      width: innerWidth * devicePixelRatio,
      height: innerHeight * devicePixelRatio,
      innerWidth,
      innerHeight,
      devicePixelRatio,
    };
  };

  // scene
  const scene = new Scene();

  // renderer
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true;

  // camera
  const camera = new PerspectiveCamera();
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 3, 8);
  controls.target.set(0, 1.5, 0);
  controls.update();

  // add grid helper
  const gridHelper = new GridHelper(50, 50);
  scene.add(gridHelper);

  // background image
  const backgroundTexture = new TextureLoader().load(backgroundMapUrl);

  const initDeviceSize = getDeviceSize();

  //composer
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const rayMarchingPass = new ShaderPass({
    ...RayMarchingShader,
    uniforms: {
      uTime: { value: 0 },
      hdriMap: { value: backgroundTexture },
      cPos: { value: camera.position.clone() },
      resolution: {
        value: new Vector2(initDeviceSize.width, initDeviceSize.height),
      },
      cameraQuaternion: { value: camera.quaternion.clone() },
      fov: { value: camera.fov },
    },
  });
  composer.addPass(rayMarchingPass);

  // render loop
  const onAnimationFrameHandler = (timeStamp: number) => {
    if (!isRunning) return;

    // update the time uniform of the shader
    rayMarchingPass.uniforms.uTime.value = timeStamp / 100;
    const worldPos = new Vector3();
    rayMarchingPass.uniforms.cPos.value.copy(camera.getWorldPosition(worldPos));
    const cameraQuaternion = new Quaternion();
    rayMarchingPass.uniforms.cameraQuaternion.value.copy(
      camera.getWorldQuaternion(cameraQuaternion)
    );
    rayMarchingPass.uniforms.fov.value = camera.fov;
    composer.render();
    window.requestAnimationFrame(onAnimationFrameHandler);
  };
  window.requestAnimationFrame(onAnimationFrameHandler);

  // resize
  const windowResizeHanlder = () => {
    const { width, height, innerHeight, innerWidth } = getDeviceSize();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    rayMarchingPass.uniforms.resolution.value.set(width, height);
  };
  windowResizeHanlder();
  window.addEventListener("resize", windowResizeHanlder);

  return {
    canvas: renderer.domElement,
    stop: () => {
      window.removeEventListener("resize", windowResizeHanlder);
      isRunning = false;
    },
  };
};
