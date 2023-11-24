import { useControls } from "leva";
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

interface ConfigStore {
  grow: number
  debugCamera: boolean
  debugGrid: boolean
  renderBranches: boolean
  debugBranches: boolean
  renderBranchlets: boolean
  debugBranchlets: boolean
  renderLeaves: boolean
  debugLeaves: boolean
}

export const useConfigStore = create<ConfigStore>(() => ({
  grow: 10,
  debugCamera: false,
  debugGrid: false,
  renderBranches: true,
  debugBranches: false,
  renderBranchlets: true,
  debugBranchlets: false,
  renderLeaves: true,
  debugLeaves: false,
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
    debugCamera: {
      value: false,
      onChange: (value) => {
        useConfigStore.setState({ debugCamera: value })
      }
    },
    debugGrid: {
      value: false,
      onChange: (value) => {
        useConfigStore.setState({ debugGrid: value })
      }
    }
  }));

  useControls('Branches', () => ({
    render: {
      value: true,
      onChange: (value) => {
        useConfigStore.setState({ renderBranches: value })
      }
    },
    debug: {
      value: false,
      onChange: (value) => {
        useConfigStore.setState({ debugBranches: value })
      }
    }
  }))

  useControls('Branchlets', () => ({
    render: {
      value: true,
      onChange: (value) => {
        useConfigStore.setState({ renderBranchlets: value })
      }
    },
    debug: {
      value: false,
      onChange: (value) => {
        useConfigStore.setState({ debugBranchlets: value })
      }
    }
  }))

  useControls('Leaves', () => ({
    render: {
      value: true,
      onChange: (value) => {
        useConfigStore.setState({ renderLeaves: value })
      }
    },
    debug: {
      value: false,
      onChange: (value) => {
        useConfigStore.setState({ debugLeaves: value })
      }
    }
  }))

  return
}

export const useConfig = () => {
  return useConfigStore(state => ({
    grow: state.grow,
    debugCamera: state.debugCamera,
    debugGrid: state.debugGrid,
    debugBranches: state.debugBranches,
    renderBranches: state.renderBranches,
    debugBranchlets: state.debugBranchlets,
    renderBranchlets: state.renderBranchlets,
    debugLeaves: state.debugLeaves,
    renderLeaves: state.renderLeaves,
  }), shallow)
}
