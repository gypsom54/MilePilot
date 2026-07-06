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
};

/**
 * Placeholder business — will be replaced by multi-business support (AuraCore).
 */
export const PLACEHOLDER_BUSINESS = {
  name: "RankAura Demo",
  industry: "Digital Marketing",
  logoInitial: "R",
};

/**
 * Navigation items for the dashboard shell.
 * Future routes will map to Scout, Writer, Optimiser, etc.
 */
export const NAV_ITEMS = [
  { label: "Dashboard", icon: "🏠", href: "/", active: true },
  { label: "AI Team", icon: "🤖", href: "#", active: false },
  { label: "Growth", icon: "📈", href: "#", active: false },
  { label: "Content", icon: "📝", href: "#", active: false },
  { label: "Website", icon: "🌐", href: "#", active: false },
  { label: "Settings", icon: "⚙️", href: "#", active: false },
] as const;
