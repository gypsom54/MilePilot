import Image from 'next/image';

type PackagingAccent = 'blue' | 'teal' | 'gold' | 'copper' | 'neutral';

interface PackagingRenderProps {
  src: string;
  alt: string;
  accent?: PackagingAccent;
  variant?: 'hero' | 'feature' | 'system';
  priority?: boolean;
}

export function PackagingRender({
  src,
  alt,
  accent = 'neutral',
  variant = 'feature',
  priority = false,
}: PackagingRenderProps) {
  return (
    <div className={`packaging-render packaging-render--${variant} packaging-render--${accent}`}>
      <div className="packaging-render__glow" aria-hidden="true" />
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
      </div>
    </div>
  );
}
