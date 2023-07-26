import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Vector3 } from "three";
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

/** Absolute up vector */
const upVector = new Vector3(0, 1, 0)

interface ConfigStore {
  grow: number
  debug: boolean
  debugGrid: boolean
}

export const useConfigStore = create<ConfigStore>((set) => ({
  grow: 10,
  debug: false,
  debugGrid: false,
}))

/** Should be used only once */
export const useConfigControls = () => {

  useControls(() => ({
    grow: {
      value: 0,
      min: 0,
      max: 1.3,
      step: 0.001,
      onChange: (value) => {
        useConfigStore.setState({ grow: value })
      }
    },
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
    grow: state.grow,
    debug: state.debug
  }), shallow)
}
