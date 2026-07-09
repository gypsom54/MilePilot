'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Component = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = `reveal${visible ? ' reveal--in' : ''}${className ? ` ${className}` : ''}`;

  return (
    <Component ref={ref} className={classes} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Component>
  );
}
