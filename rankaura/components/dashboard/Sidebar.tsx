import { NAV_ITEMS } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";

export function Sidebar() {
  return (
    <aside className="flex w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <div className="px-5 py-6">
        <Logo />
      </div>

      <nav className="flex-1 px-3" aria-label="Main navigation">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={
                  item.active
                    ? "flex items-center rounded-lg bg-[var(--color-aura-glow)] px-3 py-2 text-sm font-medium text-[var(--color-aura)]"
                    : "flex items-center rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text-primary)]"
                }
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[var(--color-border-subtle)] p-4">
        <p className="text-xs text-[var(--color-text-muted)]">
          {/* AuraCore: user profile & business context */}
          Jonathan&apos;s Business
        </p>
      </div>
    </aside>
  );
}
