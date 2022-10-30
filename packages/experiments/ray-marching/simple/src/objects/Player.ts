import { Group } from "three";
import { degToRad } from "three/src/math/MathUtils";
import { GameCamera } from "./Camera";
import { Action, keyControls, XVector, YVector, ZVector } from "./controls";

// from 0 to 1
const sensitivity = 0.5;

export class Player extends Group {
  public camera;
  public pressedKeys: {[key: string]: boolean} = {};

  constructor() {
    super();
    this.camera = new GameCamera();
    this.add(this.camera);
    document.addEventListener('keydown', (e) => {
      const code = e.code;
      this.pressedKeys[code] = true;
    })
    document.addEventListener('keyup', (e) => {
      const code = e.code;
      delete this.pressedKeys[code];
    })
  }

  public isCodePressed = (code: string) => {
    return this.pressedKeys[code];
  }

  public activeKey = (key: Action) => this.isCodePressed(keyControls[key]);

  public onFrame = () => {
    if(this.activeKey('RotateRight')) {
      this.rotateOnWorldAxis(YVector, degToRad(sensitivity * -4));
    }
    if(this.activeKey('RotateLeft')) {
      this.rotateOnWorldAxis(YVector, degToRad(sensitivity * 4));
    }
    if(this.activeKey('MoveForward')) {
      this.translateOnAxis(ZVector, sensitivity * -0.5);
    }
    if(this.activeKey('MoveBackward')) {
      this.translateOnAxis(ZVector, sensitivity * 0.5);
    }
    if(this.activeKey('MoveLeft')) {
      this.translateOnAxis(XVector, sensitivity * -0.5);
    }
    if(this.activeKey('MoveRight')) {
      this.translateOnAxis(XVector, sensitivity * 0.5);
    }
    if(this.activeKey('MoveUp')) {
      this.translateOnAxis(YVector, sensitivity * 0.5);
    }
    if(this.activeKey('MoveDown')) {
      this.translateOnAxis(YVector, sensitivity * -0.5);
    }
    this.camera.onFrame();
  }

}