import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  GridHelper,
  Quaternion,
} from "../node_modules/three";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { editLavaUniform, lavaGroup } from "./objects/lamp";
import GUI from "lil-gui";
import { AmbientLight, PointLight } from "three";
import { LavaMaterial } from "./objects/lamp/lava-shader";

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
  camera.position.set(0, 1, 3);
  controls.target.set(0, 1, 0);
  controls.update();

  // objects
  lavaGroup.position.set(0.1, 0.93, -0.7);
  scene.add(lavaGroup);

  // lights

  scene.add(new AmbientLight(0xffffff, 0.1));
  const centerLight = new PointLight(0xffffff, 1);
  centerLight.position.set(0, 5, 0);
  scene.add(centerLight);

  // add grid helper
  const gridHelper = new GridHelper(50, 50);
  scene.add(gridHelper);

  const initDeviceSize = getDeviceSize();

  //composer
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const options = {
    voxelSize: LavaMaterial.uniforms.uVoxelSize.value,
    useVoxels: LavaMaterial.uniforms.uVoxels.value,
  };
  const gui = new GUI({
    title: "Options",
    width: 300,
  });
  gui.add(options, "useVoxels").onChange((value: boolean) => {
    editLavaUniform("uVoxels", value);
  });
  gui.add(options, "voxelSize", 0.01, 0.07, 0.01).onChange((value: number) => {
    editLavaUniform("uVoxelSize", value);
  });

  // render loop
  const onAnimationFrameHandler = (timeStamp: number) => {
    if (!isRunning) return;
    editLavaUniform("uTime", timeStamp);

    // update the time uniform of the shader
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
  };
  windowResizeHanlder();
  window.addEventListener("resize", windowResizeHanlder);

  return {
    canvas: renderer.domElement,
    stop: () => {
      window.removeEventListener("resize", windowResizeHanlder);
      isRunning = false;
      gui.destroy();
    },
  };
};
