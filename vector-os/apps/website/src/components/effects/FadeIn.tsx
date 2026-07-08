'use client';

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  id?: string;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  as: Component = 'div',
  id,
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const classes = `reveal${visible ? ' reveal--visible' : ''}${className ? ` ${className}` : ''}`;

  return (
    <Component
      ref={ref}
      id={id}
      className={classes}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
