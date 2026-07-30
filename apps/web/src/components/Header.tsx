import { NavLink } from "react-router-dom";
import "./Header.css";

type HeaderProps = {
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export function Header({ menuOpen, onToggleMenu }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <NavLink className="app-header__brand" to="/" end>
          SEO AutoPilot
        </NavLink>

        <nav className="app-header__nav" aria-label="Primary">
          <NavLink className={navClass} to="/" end>
            Home
          </NavLink>
          <NavLink className={navClass} to="/workspace">
            Workspace
          </NavLink>
          <NavLink className={navClass} to="/learn">
            Learning Centre
          </NavLink>
        </nav>

        <button
          type="button"
          className="app-header__menu-button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={onToggleMenu}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="app-header__menu-icon" aria-hidden="true">
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>
    </header>
  );
}

function navClass({ isActive }: { isActive: boolean }) {
  return `app-header__link${isActive ? " app-header__link--active" : ""}`;
}
