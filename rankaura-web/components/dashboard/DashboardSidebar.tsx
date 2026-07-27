import type { ReactNode } from "react";
import type { BusinessIdentity, NavId } from "@/types/dashboard";
import { cn } from "@/utils/cn";

const NAV_ICONS: Record<NavId, ReactNode> = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" strokeLinejoin="round" />
    </svg>
  ),
  "ai-team": (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="7" y="8" width="10" height="10" rx="2" />
      <circle cx="10" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M12 4v2M9 20h6M12 18v2" strokeLinecap="round" />
    </svg>
  ),
  growth: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 18V6M4 18h16" strokeLinecap="round" />
      <path d="M8 14l3-3 3 2 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  content: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 4h7l3 3v13H7V4z" strokeLinejoin="round" />
      <path d="M14 4v3h3M9 11h6M9 15h6" strokeLinecap="round" />
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.5 2.8 2.5 13.2 0 16M12 4c-2.5 2.8-2.5 13.2 0 16" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M4.9 6.5l1.4 1.4M17.7 16.1l1.4 1.4M3 12h2M19 12h2M4.9 17.5l1.4-1.4M17.7 7.9l1.4-1.4" strokeLinecap="round" />
    </svg>
  ),
};

interface DashboardSidebarProps {
  business: BusinessIdentity;
  navItems: { id: NavId; label: string }[];
  activeNav: NavId;
}

export function DashboardSidebar({ business, navItems, activeNav }: DashboardSidebarProps) {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#eef0f3] bg-white px-5 py-6">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b1b3a] text-sm font-semibold text-white">
          {business.ownerInitial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#080f1a]">{business.name}</p>
          <p className="truncate text-xs text-[#8b95a5]">{business.industry}</p>
        </div>
      </div>

      <nav className="mt-10 space-y-1" aria-label="Main">
        {navItems.map((item) => {
          const active = item.id === activeNav;
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                active ? "bg-[#eaf1ff] text-[#2f6bff]" : "text-[#080f1a]",
              )}
            >
              <span className={cn(active ? "text-[#2f6bff]" : "text-[#080f1a]")}>
                {NAV_ICONS[item.id]}
              </span>
              {item.label}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
