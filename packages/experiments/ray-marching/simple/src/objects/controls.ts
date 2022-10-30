import { Vector3 } from "three";

export type Action = 'RotateLeft'
| 'RotateRight'
| 'LookUp'
| 'LookDown'
| 'MoveForward'
| 'MoveBackward'
| 'MoveLeft'
| 'MoveRight'
| 'MoveUp'
| 'MoveDown';

export type IKeyControls = {
  [key in Action]: string;
}

export const keyControls: IKeyControls = {
  RotateLeft: 'ArrowLeft',
  RotateRight: 'ArrowRight',
  LookUp: 'ArrowUp',
  LookDown: 'ArrowDown',
  MoveForward: 'KeyW',
  MoveBackward: 'KeyS',
  MoveLeft: 'KeyA',
  MoveRight: 'KeyD',
  MoveUp: 'KeyQ',
  MoveDown: 'KeyE',
};

export const YVector = new Vector3(0, 1, 0);
export const XVector = new Vector3(1, 0, 0);
export const ZVector = new Vector3(0, 0, 1);