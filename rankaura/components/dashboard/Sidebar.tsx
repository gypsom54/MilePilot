import { BusinessProfile } from "@/components/dashboard/BusinessProfile";
import { NAV_ITEMS } from "@/lib/constants";
import type { BusinessProfile as BusinessProfileType } from "@/types/dashboard";

interface SidebarProps {
  business: BusinessProfileType;
}

export function Sidebar({ business }: SidebarProps) {
  return (
    <aside className="flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <div className="px-5 py-7">
        <BusinessProfile business={business} />
      </div>

      <nav className="flex-1 px-3" aria-label="Main navigation">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={
                  item.active
                    ? "flex items-center gap-2.5 rounded-lg bg-[var(--color-aura-glow)] px-3 py-2.5 text-sm font-medium text-[var(--color-aura)]"
                    : "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text-primary)]"
                }
              >
                <span aria-hidden className="text-base leading-none">
                  {item.icon}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[var(--color-border-subtle)] p-5">
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          {/* AuraCore: session & business context */}
          Your AI team is on duty
        </p>
      </div>
    </aside>
  );
}
