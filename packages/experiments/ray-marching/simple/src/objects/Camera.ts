import { PerspectiveCamera } from "three";
import { degToRad } from "three/src/math/MathUtils";
import { Action, keyControls, XVector } from "./controls";



/*
vector = camera.getWorldDirection();
theta = Math.atan2(vector.x,vector.z);
*/

/*
const cameraEuler = new Euler().setFromQuaternion(this.quaternion, 'YXZ');
cameraEuler.y = 0;
cameraEuler.z = 0;
cameraEuler.x = -cameraEuler.x;
const direction = ZVector.clone();
direction.applyEuler(cameraEuler);
*/

// from 0 to 1
const sensitivity = 0.5;

export class GameCamera extends PerspectiveCamera {

  public pressedKeys: {[key: string]: boolean} = {};

  constructor(fov?: number, aspect?: number, near?: number, far?: number) {
    super(fov, aspect, near, far);
    document.addEventListener('keydown', (e) => {
      const code = e.code;
      this.pressedKeys[code] = true;
    })
    document.addEventListener('keyup', (e) => {
      const code = e.code;
      delete this.pressedKeys[code];
    })

    this.position.set(0.0, 2.0, 0.0);
  }

  public isCodePressed = (code: string) => {
    return this.pressedKeys[code];
  }

  public activeKey = (key: Action) => this.isCodePressed(keyControls[key]);

  public onFrame = () => {    
    if(this.activeKey('LookUp')) {
      this.rotateOnAxis(XVector, degToRad(sensitivity * 4));
    }
    if(this.activeKey('LookDown')) {
      this.rotateOnAxis(XVector, degToRad(sensitivity * -4));
    }
    
  }

}

