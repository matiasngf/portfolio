import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Euler, Vector2, Vector3 } from "three";
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

/** Absolute up vector */
const upVector = new Vector3(0, 1, 0)

interface ConfigStore {
  debug: boolean
  setDebug: (debug: boolean) => void
  /** Rotation in quaternion */
  objectRotation: Euler
  objectRotationDirection: Vector2
  fluidRotationForce: Vector2
  fluidNoise: number
  objectRotationAxis: Vector3
  objectNewUp: Vector3
  objectPrevUp: Vector3
  setObjectRotation: (rotation: Euler) => void
  raf: () => void
}

const defaultDebug = false

const getRotationAngle = (prevVector: Vector3, newVector: Vector3) => {
  const rotationAngleRaw = Math.acos(prevVector.dot(newVector))
  return rotationAngleRaw > 0.0001 ? rotationAngleRaw : 0
}

const useConfigStore = create<ConfigStore>((set) => ({
  debug: defaultDebug,
  setDebug: (debug: boolean) => set({ debug }),

  objectRotation: new Euler(0, 0, 0, 'XZY'),
  objectRotationDirection: new Vector2(0, 0),
  objectRotationAxis: new Vector3(0, 1, 0),
  objectNewUp: new Vector3(0, 1, 0),
  objectPrevUp: new Vector3(0, 1, 0),

  fluidRotationForce: new Vector2(0, 0),
  fluidNoise: 0,

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
    const fluidNoise = prev.fluidNoise + fluidRotationForce.length()

    return {
      objectRotation: rotation,
      objectRotationDirection: rotationDirection.clone().normalize(),
      objectRotationAxis: rotationAxis,
      objectNewUp: newUp,
      objectPrevUp: prevRUp,
      fluidRotationForce,
      fluidNoise
    }
  }),
  raf: () => set((prev) => {
    const fluidRotationForce = prev.fluidRotationForce.clone().multiplyScalar(0.9)
    let fluidNoise = prev.fluidNoise * 0.9
    if (fluidNoise < 0.0001) {
      fluidNoise = 0
    }

    return {
      fluidRotationForce,
      fluidNoise
    }
  })
}))

/** Should be used only once */
export const useConfigControls = () => {
  const setObjectRotation = useConfigStore(state => state.setObjectRotation)
  const raf = useConfigStore(state => state.raf)

  useControls(() => ({
    objectRotation: {
      label: "Object rotation",
      value: {
        x: 0,
        y: 0,
        z: 0,
      },
      step: 0.01,
      onChange: (value) => {
        setObjectRotation(new Euler(value.x, value.y, value.z, 'XZY'))
      }
    },
    debug: {
      value: defaultDebug,
      onChange: (value) => {
        useConfigStore.setState({ debug: value })
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
    fluidNoise: state.fluidNoise
  }), shallow)
}