'use client';

import Image from 'next/image';
import { useMousePosition } from '@/hooks/useMousePosition';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type PackagingAccent = 'blue' | 'teal' | 'gold' | 'copper' | 'neutral';

interface PackagingRenderProps {
  src: string;
  alt: string;
  accent?: PackagingAccent;
  variant?: 'hero' | 'feature' | 'system';
  priority?: boolean;
  living?: boolean;
}

export function PackagingRender({
  src,
  alt,
  accent = 'neutral',
  variant = 'feature',
  priority = false,
  living = false,
}: PackagingRenderProps) {
  const mouseRef = useMousePosition<HTMLDivElement>();
  const reducedMotion = usePrefersReducedMotion();

  const classes = [
    'packaging-render',
    `packaging-render--${variant}`,
    `packaging-render--${accent}`,
    living && !reducedMotion ? 'packaging-render--living' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={mouseRef} className={classes} style={{ '--mouse-x': '0.5', '--mouse-y': '0.5' } as React.CSSProperties}>
      <div className="packaging-render__floor" aria-hidden="true" />
      <div className="packaging-render__glow" aria-hidden="true" />
      <div className="packaging-render__rim" aria-hidden="true" />
      <div className="packaging-render__spotlight" aria-hidden="true" />
      <div className="packaging-render__frame">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={
            variant === 'hero'
              ? '(max-width: 768px) 100vw, 50vw'
              : variant === 'system'
                ? '(max-width: 768px) 100vw, 55vw'
                : '(max-width: 768px) 100vw, 45vw'
          }
          className="packaging-render__image"
        />
        {living && !reducedMotion && (
          <>
            <div className="packaging-render__hologram" aria-hidden="true" />
            <div className="packaging-render__reflection" aria-hidden="true" />
          </>
        )}
      </div>
    </div>
  );
}
