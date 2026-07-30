import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./MobileNavigation.css";

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="mobile-nav" id="mobile-navigation">
      <div className="mobile-nav__backdrop" onClick={onClose} aria-hidden="true" />
      <nav className="mobile-nav__panel" aria-label="Mobile">
        <NavLink className={navClass} to="/" end onClick={onClose}>
          Home
        </NavLink>
        <NavLink className={navClass} to="/workspace" onClick={onClose}>
          Workspace
        </NavLink>
        <NavLink className={navClass} to="/ask" onClick={onClose}>
          Ask
        </NavLink>
        <NavLink className={navClass} to="/learn" onClick={onClose}>
          Learning Centre
        </NavLink>
      </nav>
    </div>
  );
}

function navClass({ isActive }: { isActive: boolean }) {
  return `mobile-nav__link${isActive ? " mobile-nav__link--active" : ""}`;
}
