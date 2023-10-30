import { useControls } from 'leva'
import { create } from 'zustand'


interface ConfigStore {
  showGrid: boolean
}

export const useConfigStore = create<ConfigStore>((set) => ({
  showGrid: false
}))

export const useConfig = () => {
  const showGrid = useConfigStore((state) => state.showGrid)

  useControls(() => ({
    showGrid: {
      value: showGrid,
      onChange: (showGrid) => {
        useConfigStore.setState({ showGrid })
      }
    }
  }))
}