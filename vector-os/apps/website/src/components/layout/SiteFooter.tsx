import Link from 'next/link';
import { VectorLogo } from './VectorLogo';

const FOOTER_LINKS = [
  { label: 'Products', href: '#products' },
  { label: 'Platform', href: '#platform' },
  { label: 'Documentation', href: '#documentation' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <VectorLogo />
          <span className="site-footer__wordmark">Vector</span>
        </div>

        <nav className="site-footer__nav" aria-label="Footer navigation">
          {FOOTER_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="site-footer__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="site-footer__copyright">
          &copy; {year} Vector Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
