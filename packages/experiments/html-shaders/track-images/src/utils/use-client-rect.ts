import { useEffect, useRef, useState } from "react";
import { useWindowScroll } from "react-use";

export interface ClientRect {
  top: number;
  left: number;
  width: number;
  height: number;
  absoluteTop: number;
  absoluteLeft: number;
}

export function useClientRect<T extends HTMLDivElement>(
  ref: React.MutableRefObject<T>
): ClientRect {
  const [rect, setRect] = useState<DOMRect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    bottom: 0,
    right: 0,
    toJSON: () => { },
  });
  const scroll = useWindowScroll();
  const observerRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const callback = () => {
      const currentRect = ref.current.getBoundingClientRect();
      if (
        rect.top !== currentRect.top ||
        rect.left !== currentRect.left ||
        rect.width !== currentRect.width ||
        rect.height !== currentRect.height
      ) {
        setRect(currentRect);
      }
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
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    absoluteTop: rect.top + scroll.y,
    absoluteLeft: rect.left + scroll.x,
  };
}