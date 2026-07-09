import Link from 'next/link';
import { VectorBrandLockup } from './VectorBrandLockup';

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
            <SearchIcon />
          </button>
          <button type="button" className="site-header__icon-btn" aria-label="Account">
            <UserIcon />
          </button>
          <button type="button" className="site-header__icon-btn site-header__cart" aria-label="Cart">
            <CartIcon />
            <span className="site-header__cart-badge">0</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20C5 16.134 8.134 13 12 13C15.866 13 19 16.134 19 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6H20L18 14H8L6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 6L5 3H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="18" r="1.5" fill="currentColor" />
      <circle cx="17" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}
