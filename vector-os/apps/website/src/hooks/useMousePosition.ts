'use client';

import { useEffect, useRef } from 'react';

export interface NormalizedMouse {
  x: number;
  y: number;
}

export function useMousePosition<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const position = useRef<NormalizedMouse>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        position.current = { x, y };
        el.style.setProperty('--mouse-x', `${x}`);
        el.style.setProperty('--mouse-y', `${y}`);
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return ref;
}
