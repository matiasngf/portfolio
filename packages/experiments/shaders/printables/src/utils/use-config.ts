import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Color, Euler, Vector2, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

/** Absolute up vector */
const upVector = new Vector3(0, 1, 0)

interface ConfigStore {
  debug: boolean
  setDebug: (debug: boolean) => void
  debugGrid: boolean
  /** Rotation in quaternion */
  objectRotation: Euler
  objectRotationDirection: Vector2
  fluidRotationForce: Vector2
  fluidNoise: number
  fluidNoiseTarget: number
  fluidColor: Vector3
  filledPercentage: number
  objectRotationAxis: Vector3
  objectNewUp: Vector3
  objectPrevUp: Vector3
  fluidDensity: number
  maxSteps: number
  setObjectRotation: (rotation: Euler) => void
  raf: () => void
}

const defaultDebug = false

const getRotationAngle = (prevVector: Vector3, newVector: Vector3) => {
  const rotationAngleRaw = Math.acos(prevVector.dot(newVector))
  return rotationAngleRaw > 0.0001 ? rotationAngleRaw : 0
}

export const useConfigStore = create<ConfigStore>((set) => ({
  debug: defaultDebug,
  setDebug: (debug: boolean) => set({ debug }),
  debugGrid: false,

  objectRotation: new Euler(0, 0, 0, 'XZY'),
  objectRotationDirection: new Vector2(0, 0),
  objectRotationAxis: new Vector3(0, 1, 0),
  objectNewUp: new Vector3(0, 1, 0),
  objectPrevUp: new Vector3(0, 1, 0),
  fluidColor: new Vector3(0, 0, 0),
  filledPercentage: 0,
  fluidDensity: 0,
  maxSteps: 3,

  fluidRotationForce: new Vector2(0, 0),
  fluidNoise: 0,
  fluidNoiseTarget: 0,

  setObjectRotation: (rotation: Euler) => set((prev) => {

    /** Previous relative up vector */
    const prevRUp = upVector.clone().applyEuler(prev.objectRotation)
    /** New relative up vector */
    const newRUp = upVector.clone().applyEuler(rotation)

    const yRotationAngle = rotation.y - prev.objectRotation.y
    const rotationAngleRaw = getRotationAngle(prevRUp, newRUp)

    const rotationAngle = rotationAngleRaw + yRotationAngle
    const rotationAxis = rotationAngleRaw !== 0 ? prevRUp.clone().cross(newRUp).normalize() : prevRUp.clone().normalize()

    /** Simulate the Up vector attached to the object and rotating 
     * This will allow to find the direction of the rotation
     * And calculate where the water should flow.
    */
    const newUp = upVector.clone().applyAxisAngle(rotationAxis, rotationAngle)
    const rotationDirection = new Vector2(newUp.x, newUp.z)

    const fluidRotationForce = prev.fluidRotationForce.clone().add(rotationDirection)
    const fluidNoise = fluidRotationForce.length() / 1;


    const fluidNoiseTarget = Math.abs(prev.fluidNoiseTarget - prev.fluidNoise) > 3.0 ? prev.fluidNoiseTarget : prev.fluidNoiseTarget + fluidNoise



    return {
      objectRotation: rotation,
      objectRotationDirection: rotationDirection.clone().normalize(),
      objectRotationAxis: rotationAxis,
      objectNewUp: newUp,
      objectPrevUp: prevRUp,
      fluidRotationForce,
      fluidNoiseTarget
    }
  }),
  raf: () => set((prev) => {
    let fluidRotationForce = prev.fluidRotationForce.clone().multiplyScalar(0.97)
    if (fluidRotationForce.length() < 0.0001) {
      fluidRotationForce = new Vector2(0, 0)
    }

    let fluidNoise = lerp(prev.fluidNoise, prev.fluidNoiseTarget, 0.04)

    if (Math.abs(prev.fluidNoise - prev.fluidNoiseTarget) < 0.0001) {
      fluidNoise = prev.fluidNoiseTarget
    }


    return {
      fluidRotationForce,
      fluidNoise
    }
  })
}))

const hexToVec3 = (hex: string) => {
  const color = new Color(hex)
  return new Vector3(color.r, color.g, color.b)
}

/** Should be used only once */
export const useConfigControls = () => {
  const raf = useConfigStore(state => state.raf)

  useControls(() => ({
    color: {
      label: "Color",
      value: "#48f78e",
      onChange: (value) => {
        useConfigStore.setState({ fluidColor: hexToVec3(value) })
      }
    },
    debug: {
      value: defaultDebug,
      onChange: (value) => {
        useConfigStore.setState({ debug: value })
      }
    },
    debugGrid: {
      value: false,
      onChange: (value) => {
        useConfigStore.setState({ debugGrid: value })
      }
    }
  }));

  useFrame(() => {
    raf()
  })

  return
}

export const useConfig = () => {
  return useConfigStore(state => ({
    objectRotation: state.objectRotation,
    objectRotationDirection: state.objectRotationDirection,
    objectRotationAxis: state.objectRotationAxis,
    objectNewUp: state.objectNewUp,
    objectPrevUp: state.objectPrevUp,
    debug: state.debug
  }), shallow)
}

export const useFluid = () => {
  return useConfigStore(state => ({
    fluidRotationForce: state.fluidRotationForce,
    fluidNoise: state.fluidNoise,
    fluidColor: state.fluidColor,
    filledPercentage: state.filledPercentage,
    fluidDensity: state.fluidDensity,
    maxSteps: state.maxSteps,
  }), shallow)
}