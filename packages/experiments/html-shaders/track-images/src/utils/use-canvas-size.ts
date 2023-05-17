import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

export const useCanvasSize = () => {
  const { gl } = useThree();
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  useEffect(() => {
    setWidth(gl.domElement.width);
    setHeight(gl.domElement.height);
  }, [gl.domElement.width, gl.domElement.height]);

  return { width, height };
};