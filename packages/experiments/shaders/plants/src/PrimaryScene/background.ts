import { Texture } from "three";
import { create } from "zustand";

export interface BackgroundStore {
  texture: Texture | null;
  setTexture: (texture: Texture) => void;
}

export const useBackgroundStore = create<BackgroundStore>((set) => ({
  texture: null,
  setTexture: (texture) => {
    set((state) => {
      return {
        texture
      }
    })
  },
}));
