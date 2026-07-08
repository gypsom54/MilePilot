import Link from 'next/link';
import { Button } from '@vector-platform/ui';
import { VectorLogo } from './VectorLogo';

const NAV_ITEMS = [
  { label: 'Products', href: '#products' },
  { label: 'Platform', href: '#platform' },
  { label: 'Research', href: '#research' },
  { label: 'Documentation', href: '#documentation' },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Vector Platform home">
          <VectorLogo />
          <span className="site-header__wordmark">Vector</span>
        </Link>

        <nav className="site-header__nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="site-header__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link href="#sign-in" className="site-header__sign-in">
            Sign In
          </Link>
          <Button variant="primary" size="sm" className="site-header__cta premium-btn premium-btn--primary premium-btn--sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
