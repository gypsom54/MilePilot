/**
 * Dashboard navigation configuration.
 * Routes will connect to module pages in future phases.
 */

export const NAV_ITEMS = [
  { label: "Dashboard", icon: "🏠", href: "/", active: true },
  { label: "AI Team", icon: "🤖", href: "#", active: false },
  { label: "Growth", icon: "📈", href: "#", active: false },
  { label: "Content", icon: "📝", href: "#", active: false },
  { label: "Website", icon: "🌐", href: "#", active: false },
  { label: "Settings", icon: "⚙️", href: "#", active: false },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
