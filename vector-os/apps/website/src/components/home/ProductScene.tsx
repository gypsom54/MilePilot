type ProductAccent = 'blue' | 'teal' | 'gold' | 'copper';

interface ProductSceneProps {
  variant?: 'hero' | 'feature';
  name: string;
  strength: string;
  accent: ProductAccent;
  reverse?: boolean;
}

export function ProductScene({
  variant = 'feature',
  name,
  strength,
  accent,
}: ProductSceneProps) {
  return (
    <div
      className={`product-scene product-scene--${accent} product-scene--${variant}`}
      aria-hidden="true"
    >
      <div className="product-scene__spotlight" />
      <div className="product-scene__floor" />

      <div className="product-scene__stage">
        <div className="product-scene__box">
          <div className="product-scene__box-face">
            <svg className="product-scene__molecule" viewBox="0 0 80 60" fill="none">
              <circle cx="40" cy="30" r="4" stroke="currentColor" strokeWidth="1" />
              <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="1" />
              <circle cx="60" cy="20" r="3" stroke="currentColor" strokeWidth="1" />
              <circle cx="25" cy="45" r="3" stroke="currentColor" strokeWidth="1" />
              <circle cx="55" cy="45" r="3" stroke="currentColor" strokeWidth="1" />
              <line x1="40" y1="30" x2="20" y2="20" stroke="currentColor" strokeWidth="0.75" />
              <line x1="40" y1="30" x2="60" y2="20" stroke="currentColor" strokeWidth="0.75" />
              <line x1="40" y1="30" x2="25" y2="45" stroke="currentColor" strokeWidth="0.75" />
              <line x1="40" y1="30" x2="55" y2="45" stroke="currentColor" strokeWidth="0.75" />
            </svg>
            <span className="product-scene__box-brand">VECTOR</span>
          </div>
          <div className="product-scene__box-side" />
        </div>

        <div className="product-scene__pen">
          <div className="product-scene__pen-tip" />
          <div className="product-scene__pen-body" />
          <div className="product-scene__pen-grip" />
        </div>

        <div className="product-scene__hologram" />
      </div>

      <div className="product-scene__caption">
        <span className="product-scene__name">{name}</span>
        <span className="product-scene__strength">{strength}</span>
      </div>
    </div>
  );
}
