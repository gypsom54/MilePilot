'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function ParallaxAmbient() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;

    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;

        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        el.style.setProperty('--parallax-x', String(x));
        el.style.setProperty('--parallax-y', String(y));
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
    };
  }, [reducedMotion]);

  return (
    <div ref={ref} className="ambient" aria-hidden="true">
      <div className="ambient__orb ambient__orb--one" />
      <div className="ambient__orb ambient__orb--two" />
      <div className="ambient__orb ambient__orb--three" />
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className={`ambient__particle ambient__particle--${i}`} />
      ))}
    </div>
  );
}
