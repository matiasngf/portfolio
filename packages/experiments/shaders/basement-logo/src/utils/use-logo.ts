import { Vector3 } from 'three'
import { create } from 'zustand'

export interface useLogoStore {
  mousePosition: Vector3
}

export const useLogoStore = create<useLogoStore>((set) => ({
  mousePosition: new Vector3()
}))