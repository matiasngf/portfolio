import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

export const useCanvasSize = () => {
  const { gl } = useThree();
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const [pixelRatio, setPixelRatio] = useState(1);
  const domWidth = gl.domElement.width;
  const domHeight = gl.domElement.height;

  useFrame(() => {
    const newPixelRatio = gl.getPixelRatio();
    if (newPixelRatio !== pixelRatio) {
      setPixelRatio(newPixelRatio);
    }
  });


  useEffect(() => {

    const newWidth = domWidth / pixelRatio;
    const newHeight = domHeight / pixelRatio;

    if (newWidth !== width) {
      setWidth(newWidth);
    }
    if (newHeight !== height) {
      setHeight(newHeight);
    }

  }, [domWidth, domHeight, pixelRatio]);

  return { width, height };
};