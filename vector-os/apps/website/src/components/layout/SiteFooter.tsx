import Link from 'next/link';
import { VectorBrandLockup } from './VectorBrandLockup';
import { IconEmail, IconInstagram, IconLinkedIn } from '@/components/icons/PackagingIcons';

const FOOTER_LINKS = {
  Products: ['Research Series', 'Retatrutide', 'BPC-157 + TB500', 'NAD+', 'GHK-Cu'],
  Quality: ['Quality Assurance', 'Batch Verification', 'Testing Standards', 'Certificates'],
  Documentation: ['Product Data', 'Batch Records', 'Safety Data', 'Compliance'],
  Company: ['About Vector', 'Contact', 'Terms', 'Privacy'],
} as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer section--dark" id="contact">
      <div className="site-footer__grid">
        <div className="site-footer__brand-col">
          <VectorBrandLockup variant="footer" />
          <p className="site-footer__desc">
            Premium research peptides with rigorous independent testing, professional
            packaging and secure UK fulfilment.
          </p>
          <p className="site-footer__copy">&copy; {year} Vector Peptides UK</p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <nav key={heading} className="site-footer__col" aria-label={`${heading} navigation`}>
            <h3 className="site-footer__col-title">{heading}</h3>
            <ul className="site-footer__col-links">
              {links.map((link) => (
                <li key={link}>
                  <Link href="#research-series">{link}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="site-footer__disclaimer">
          <p className="site-footer__disclaimer-title">Research Use Only</p>
          <p className="site-footer__disclaimer-text">
            All products are supplied strictly for laboratory research purposes only.
            Not for human or veterinary use.
          </p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span className="site-footer__domain">vectorpeptides.uk</span>
        <div className="site-footer__socials" aria-label="Social links">
          <a href="#instagram" aria-label="Instagram">
            <IconInstagram />
          </a>
          <a href="#linkedin" aria-label="LinkedIn">
            <IconLinkedIn />
          </a>
          <a href="mailto:contact@vectorpeptides.uk" aria-label="Email">
            <IconEmail />
          </a>
        </div>
      </div>
    </footer>
  );
}
