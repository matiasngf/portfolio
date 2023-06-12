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
  debugGrid: boolean
}

export const useConfigStore = create<ConfigStore>((set) => ({
  debug: false,
  debugGrid: false,
}))

const hexToVec3 = (hex: string) => {
  const color = new Color(hex)
  return new Vector3(color.r, color.g, color.b)
}

/** Should be used only once */
export const useConfigControls = () => {

  useControls(() => ({
    debug: {
      value: false,
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
    // raf
  })

  return
}

export const useConfig = () => {
  return useConfigStore(state => ({
    debug: state.debug
  }), shallow)
}
