import { useEffect, useId, useRef, useState } from "react";
import { useWindowScroll } from "react-use";

export interface ThreeImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

export const ThreeImage = (props: ThreeImageProps) => {
  const imageId = useId();
  const imageRef = useRef<HTMLImageElement>(null);
  const rect = useClientRect<HTMLImageElement>(imageRef);

  // TODO: create a context to push this data
  console.log(rect);

  return <img style={{ opacity: 0.5 }} ref={imageRef} {...props} />;
};

function useClientRect<T extends HTMLDivElement>(
  ref: React.MutableRefObject<T>
) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const scroll = useWindowScroll();
  const observerRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const callback = () => {
      setRect(ref.current.getBoundingClientRect());
    };
    observerRef.current = new MutationObserver(callback);
    observerRef.current.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    callback();
    return () => {
      observerRef.current.disconnect();
    };
  }, [ref.current, scroll.x, scroll.y]);

  return {
    ...rect,
    absoluteTop: rect?.top + scroll.y,
    absoluteLeft: rect?.left + scroll.x,
  };
}
