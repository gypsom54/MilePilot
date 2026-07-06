/**
 * App-wide constants for RankAura.
 */

export const APP_NAME = "RankAura";
export const APP_TAGLINE = "Your AI Growth Employee";

/**
 * Placeholder user — will be replaced by auth/session (AuraCore).
 */
export const PLACEHOLDER_USER = {
  firstName: "Jonathan",
  businessName: "Your Business",
};

/**
 * Navigation items for the dashboard shell.
 * Future routes will map to Scout, Writer, Optimiser, etc.
 */
export const NAV_ITEMS = [
  { label: "Home", href: "/", active: true },
  { label: "Activity", href: "#", active: false },
  { label: "Insights", href: "#", active: false },
  { label: "Settings", href: "#", active: false },
] as const;
