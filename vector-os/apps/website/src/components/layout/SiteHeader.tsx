import Link from 'next/link';
import { Button } from '@vector-platform/ui';
import { VectorLogo } from './VectorLogo';

const NAV_ITEMS = [
  { label: 'Products', href: '#products' },
  { label: 'Quality', href: '#quality' },
  { label: 'Packaging', href: '#packaging' },
  { label: 'Documentation', href: '#documentation' },
  { label: 'Contact', href: '#contact' },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Vector Peptides UK home">
          <VectorLogo />
          <span className="site-header__wordmark">Vector Peptides</span>
        </Link>

        <nav className="site-header__nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="site-header__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <Button variant="primary" size="sm" className="site-header__cta premium-btn premium-btn--primary">
          Shop Research Products
        </Button>
      </div>
    </header>
  );
}
