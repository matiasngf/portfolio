import { useEffect, useId, useRef, useState } from "react";
import { useClientRect } from "../../utils/use-client-rect";
import { useElementTracker } from "../ElementTracker";

export interface ThreeImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  vertexShader?: string;
  fragmentShader?: string;
}

export const ThreeImage = ({
  fragmentShader,
  vertexShader,
  ...props
}: ThreeImageProps) => {
  const imageId = useId();
  const imageRef = useRef<HTMLImageElement>(null);
  const rect = useClientRect<HTMLImageElement>(imageRef as any);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { register, remove } = useElementTracker();

  // Add image to global store
  useEffect(() => {
    if (!imageRef.current || !imageLoaded) return;
    register({
      id: imageId,
      type: "image",
      rect,
      source: imageRef.current.src,
      autoAdd: true,
      element: imageRef.current,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  }, [props.src, rect.top, rect.left, rect.width, rect.height, imageLoaded]);

  useEffect(() => {
    return () => {
      remove(imageId);
    };
  }, []);

  return (
    <img
      style={{
        opacity: 0,
      }}
      ref={imageRef}
      {...props}
      onLoad={(e) => {
        if (typeof props.onLoad === "function") {
          props.onLoad(e);
        }
        setImageLoaded(true);
      }}
    />
  );
};
