import { folder, useControls } from 'leva'
import { create } from 'zustand'


interface ConfigStore {
  showGrid: boolean
  followMouse: boolean
}

export const useConfigStore = create<ConfigStore>((set) => ({
  showGrid: false,
  followMouse: false,
}))

export const useConfig = () => {
  const showGrid = useConfigStore((state) => state.showGrid)
  const followMouse = useConfigStore((state) => state.followMouse)

  useControls(() => ({
    "Interactions": folder({
      showGrid: {
        label: 'Show Grid',
        value: showGrid,
        onChange: (showGrid) => {
          useConfigStore.setState({ showGrid })
        }
      },
      followMouse: {
        label: 'Follow Mouse',
        value: followMouse,
        onChange: (followMouse) => {
          useConfigStore.setState({ followMouse })
        }
      },
    }, { collapsed: true, order: 0 })
  }))
}