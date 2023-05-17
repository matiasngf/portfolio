import { useEffect, useId, useRef, useState } from "react";
import { useThreeImageContext } from "./Context";
import { useClientRect } from "../../utils/use-client-rect";

export interface ThreeImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

export const ThreeImage = (props: ThreeImageProps) => {
  const imageId = useId();
  const imageRef = useRef<HTMLImageElement>(null);
  const rect = useClientRect<HTMLImageElement>(imageRef);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { register } = useThreeImageContext();

  // Add image to global store
  useEffect(() => {
    if (!imageRef.current || !imageLoaded) return;
    register({
      id: imageId,
      rect,
      source: imageRef.current.src,
    });
  }, [props.src, rect.top, rect.left, rect.width, rect.height, imageLoaded]);

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
