import { useState, useEffect } from 'react';
import { useSmooth } from './use-smooth';

export interface UseDragOptions {
  sensitivity?: number;
  enableDamping?: boolean;
  dampingFactor?: number;
}

const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
  return 'touches' in event;
};

const getClientPosition = (event: MouseEvent | TouchEvent) => {
  if (isTouchEvent(event)) {
    return {
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY,
    };
  }
  return {
    clientX: event.clientX,
    clientY: event.clientY,
  };
}

export const useDrag = ({
  sensitivity = 1,
  dampingFactor = 0.05,
}: UseDragOptions = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [draggedX, setDraggedX] = useState(0);
  const [draggedY, setDraggedY] = useState(0);

  const draggedXSmooth = useSmooth(draggedX, dampingFactor);
  const draggedYSmooth = useSmooth(draggedY, dampingFactor);

  const maxY = 1.0;
  const minY = -0.8;



  useEffect(() => {

    const canvas = document.querySelector('canvas');
    if (!canvas) return

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      setIsDragging(true);

      const { clientX, clientY } = getClientPosition(event);

      setDragStart({ x: clientX, y: clientY });
    };

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const isTouch = isTouchEvent(event);

      if (isTouch) {
        // prevent mobile scroll
        event.preventDefault();
      }

      const { x: startX, y: startY } = dragStart;

      const { clientX, clientY } = getClientPosition(event);

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      const multiplyScalar = isTouch ? 0.013 : 0.01;

      setDraggedX((d) => d + deltaX * multiplyScalar * sensitivity);
      setDraggedY((d) => {
        const newY = d + deltaY * multiplyScalar * sensitivity
        if (newY > maxY || newY < minY) return d
        return newY

      });
      setDragStart({ x: clientX, y: clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // mouse
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    // touch
    canvas.addEventListener('touchstart', handleMouseDown);
    canvas.addEventListener('touchmove', handleMouseMove);
    canvas.addEventListener('touchend', handleMouseUp);

    return () => {
      // mouse
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      // touch
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return [
    draggedXSmooth,
    draggedYSmooth
  ];
};
