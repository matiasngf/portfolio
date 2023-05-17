import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

export const useCanvasSize = () => {
  const { gl } = useThree();
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  useEffect(() => {
    const pixelRatio = window.devicePixelRatio;
    setWidth(gl.domElement.width / pixelRatio);
    setHeight(gl.domElement.height / pixelRatio);
  }, [gl.domElement.width, gl.domElement.height]);

  return { width, height };
};