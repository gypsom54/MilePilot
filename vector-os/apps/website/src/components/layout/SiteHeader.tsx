import Link from 'next/link';
import { VectorBrandLockup } from './VectorBrandLockup';
import { IconCart, IconSearch, IconUser } from '@/components/icons/PremiumIcons';

const NAV_ITEMS = [
  { label: 'Products', href: '#research-series' },
  { label: 'Research Series', href: '#research-series' },
  { label: 'Quality Assurance', href: '#quality' },
  { label: 'Documentation', href: '#documentation' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__glass" aria-hidden="true" />
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Vector Peptides home">
          <VectorBrandLockup variant="header" />
        </Link>

        <nav className="site-header__nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className="site-header__link">
              <span className="site-header__link-text">{item.label}</span>
              <span className="site-header__link-line" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <div className="site-header__actions" aria-label="Account actions">
          <button type="button" className="site-header__icon-btn" aria-label="Search">
            <IconSearch />
          </button>
          <button type="button" className="site-header__icon-btn" aria-label="Account">
            <IconUser />
          </button>
          <button type="button" className="site-header__icon-btn site-header__cart" aria-label="Cart">
            <IconCart />
            <span className="site-header__cart-badge">0</span>
          </button>
        </div>
      </div>
    </header>
  );
}
