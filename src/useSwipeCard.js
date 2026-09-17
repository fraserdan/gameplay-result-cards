import { useState } from "react";

const DEFAULTS = {
  threshold: 110,
  exitDistance: 700,
  exitRotation: 24,
  exitDuration: 340,
  maxRotation: 16,
};

// Tinder-style drag: rotate + scale as the pointer moves, fling off past a
// distance threshold, spring back below it. Shared by every swipeable card
// in the app so the interaction always feels identical.
export default function useSwipeCard({
  onSwipeLeft,
  onSwipeRight,
  threshold = DEFAULTS.threshold,
  exitDistance = DEFAULTS.exitDistance,
  exitRotation = DEFAULTS.exitRotation,
  exitDuration = DEFAULTS.exitDuration,
  maxRotation = DEFAULTS.maxRotation,
} = {}) {
  const [drag, setDrag] = useState({ x: 0, dragging: false });
  const [exiting, setExiting] = useState(null);
  const [startX, setStartX] = useState(0);

  const handlePointerDown = (e) => {
    if (exiting) return;
    setStartX(e.clientX - drag.x);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag((d) => ({ ...d, dragging: true }));
  };

  const handlePointerMove = (e) => {
    if (!drag.dragging || exiting) return;
    setDrag({ x: e.clientX - startX, dragging: true });
  };

  const finishSwipe = (direction) => {
    setExiting(direction);
    setDrag({ x: direction === "right" ? exitDistance : -exitDistance, dragging: false });
    window.setTimeout(() => {
      if (direction === "right") onSwipeRight?.();
      else onSwipeLeft?.();
    }, exitDuration);
  };

  const handlePointerUp = () => {
    if (!drag.dragging) return;
    if (Math.abs(drag.x) > threshold) {
      finishSwipe(drag.x > 0 ? "right" : "left");
    } else {
      setDrag({ x: 0, dragging: false });
    }
  };

  const rotation = Math.max(-1, Math.min(1, drag.x / 320)) * (exiting ? exitRotation : maxRotation);
  const scale = exiting ? 0.94 : 1 - Math.min(Math.abs(drag.x) / 1400, 0.08);

  return {
    dragX: drag.x,
    dragging: drag.dragging,
    exiting,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
    style: {
      transform: `translateX(${drag.x}px) rotate(${rotation}deg) scale(${scale})`,
      transition: drag.dragging ? "none" : `transform ${exitDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    },
  };
}
