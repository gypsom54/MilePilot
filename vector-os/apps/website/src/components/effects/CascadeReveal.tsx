'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CascadeRevealProps {
  children: ReactNode;
  className?: string;
}

export function CascadeReveal({ children, className }: CascadeRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.classList.add('cascade--in');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('cascade--in');
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const classes = `cascade${className ? ` ${className}` : ''}`;

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}

interface CascadeItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function CascadeItem({ children, className, index = 0 }: CascadeItemProps) {
  const classes = `cascade__item${className ? ` ${className}` : ''}`;
  const style = { '--cascade-index': index } as CSSProperties;

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
