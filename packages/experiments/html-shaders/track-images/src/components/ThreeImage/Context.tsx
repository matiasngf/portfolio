import { PropsWithChildren, createContext, useContext, useState } from "react";
import { ClientRect } from "../../utils/use-client-rect";

export interface ShaderImage {
  id: string;
  rect: ClientRect;
  source: string;
}

export interface ShaderImageStore {
  [id: string]: ShaderImage;
}

export interface ThreeImageContextValue {
  register: (image: ShaderImage) => void;
  shaderImages: ShaderImageStore;
}

export const ThreeImageContext = createContext<ThreeImageContextValue>({
  register: () => {},
  shaderImages: {},
});

export const ThreeImageContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [shaderImages, setShaderImages] = useState<ShaderImageStore>({});
  const register = (image: ShaderImage) => {
    setShaderImages((shaderImage) => ({
      ...shaderImage,
      [image.id]: image,
    }));
  };

  return (
    <ThreeImageContext.Provider
      value={{
        register,
        shaderImages,
      }}
    >
      {children}
    </ThreeImageContext.Provider>
  );
};

export function useThreeImageContext() {
  return useContext(ThreeImageContext);
}
