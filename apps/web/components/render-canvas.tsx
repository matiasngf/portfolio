import { useEffect, useRef } from "react";

export interface RenderCanvasProps {
  canvas?: HTMLElement | HTMLCanvasElement | null
}

export const RenderCanvas = ({ canvas }: RenderCanvasProps) => {
  const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if(container.current && canvas) {
        container.current.innerHTML = "";
        container.current.append(canvas);
      }
    }, [ container, canvas ]);

    return (
        <div ref={ container } />
    )
}