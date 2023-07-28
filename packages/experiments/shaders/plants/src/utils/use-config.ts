import { useControls } from "leva";
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

interface ConfigStore {
  grow: number
  debug: boolean
  debugGrid: boolean
}

export const useConfigStore = create<ConfigStore>(() => ({
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

  return
}

export const useConfig = () => {
  return useConfigStore(state => ({
    grow: state.grow,
    debug: state.debug
  }), shallow)
}
