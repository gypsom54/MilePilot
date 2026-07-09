'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { VectorBrandLockup } from '@/components/layout/VectorBrandLockup';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface LoadingExperienceProps {
  children: ReactNode;
}

export function LoadingExperience({ children }: LoadingExperienceProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<'loading' | 'pulse' | 'reveal' | 'done'>(
    reducedMotion ? 'done' : 'loading',
  );

  useEffect(() => {
    if (reducedMotion) return;

    const pulseTimer = window.setTimeout(() => setPhase('pulse'), 400);
    const revealTimer = window.setTimeout(() => setPhase('reveal'), 1400);
    const doneTimer = window.setTimeout(() => setPhase('done'), 2000);

    return () => {
      window.clearTimeout(pulseTimer);
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
  }, [reducedMotion]);

  const showOverlay = phase !== 'done';

  return (
    <>
      {showOverlay && (
        <div
          className={`loading-screen${phase === 'pulse' ? ' loading-screen--pulse' : ''}${phase === 'reveal' ? ' loading-screen--reveal' : ''}`}
          aria-hidden={phase === 'reveal'}
          aria-live="polite"
        >
          <div className="loading-screen__inner">
            <VectorBrandLockup variant="loading" />
            <p className="loading-screen__tagline">Preparing Research Environment</p>
          </div>
        </div>
      )}
      <div className={`page-shell${phase === 'done' || phase === 'reveal' ? ' page-shell--visible' : ''}`}>
        {children}
      </div>
    </>
  );
}
