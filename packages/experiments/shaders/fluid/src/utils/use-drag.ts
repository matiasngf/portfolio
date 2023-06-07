import { useState, useEffect } from 'react';
import { useSmooth } from './use-smooth';

export interface UseDragOptions {
  sensitivity?: number;
  enableDamping?: boolean;
  dampingFactor?: number;
}

const getClientPosition = (event: MouseEvent | TouchEvent) => {
  if ('touches' in event) {
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

    const handleMouseDown = (event) => {
      // event.preventDefault();
      setIsDragging(true);

      const { clientX, clientY } = getClientPosition(event);

      setDragStart({ x: clientX, y: clientY });
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;
      const { x: startX, y: startY } = dragStart;

      const { clientX, clientY } = getClientPosition(event);

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      setDraggedX((d) => d + deltaX * 0.01 * sensitivity);
      setDraggedY((d) => {
        const newY = d + deltaY * 0.01 * sensitivity
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
