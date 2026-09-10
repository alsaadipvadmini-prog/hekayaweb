import { useState, TouchEvent } from 'react';

export function useSwipeToDismiss(onClose: () => void) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const onTouchStart = (e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 60) {
      onClose();
      setTimeout(() => setDragY(0), 300); // Reset after close animation
    } else {
      setDragY(0);
    }
  };

  return {
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    style: {
      maxHeight: '85vh',
      marginBottom: 'env(safe-area-inset-bottom, 20px)',
      overflowY: 'auto' as const,
      WebkitOverflowScrolling: 'touch' as const,
      touchAction: 'pan-y' as const,
      overscrollBehavior: 'contain' as const,
      transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
      transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }
  };
}
