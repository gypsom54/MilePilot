import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <p className="app-footer__brand">SEO AutoPilot</p>
        <p className="app-footer__text">
          A calm growth adviser for business owners. Clear guidance, honest expectations,
          no jargon walls.
        </p>
        <nav className="app-footer__nav" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/learn">Learning Centre</Link>
        </nav>
      </div>
    </footer>
  );
}
