import Link from 'next/link';
import { VectorLogo } from './VectorLogo';

const NAV_ITEMS = [
  { label: 'Products', href: '#products' },
  { label: 'Platform', href: '#platform' },
  { label: 'Documentation', href: '#documentation' },
  { label: 'About', href: '#about' },
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
      </div>
    </header>
  );
}
