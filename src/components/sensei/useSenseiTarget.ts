import { useEffect, useState, useCallback } from 'react';

export interface TargetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export function useSenseiTarget(targetId: string | null) {
  const [targetRect, setTargetRect] = useState<TargetPosition | null>(null);

  const updatePosition = useCallback(() => {
    if (!targetId) {
      setTargetRect(null);
      return;
    }

    // Look for [data-sensei-target="targetId"] or #targetId
    const el = document.querySelector(`[data-sensei-target="${targetId}"]`) || document.getElementById(targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      });

      // Add temporary highlight class
      el.classList.add('sensei-highlighted-target');
    } else {
      setTargetRect(null);
    }
  }, [targetId]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      // Clean up highlight
      if (targetId) {
        const el = document.querySelector(`[data-sensei-target="${targetId}"]`) || document.getElementById(targetId);
        el?.classList.remove('sensei-highlighted-target');
      }
    };
  }, [targetId, updatePosition]);

  return { targetRect, refreshTarget: updatePosition };
}
