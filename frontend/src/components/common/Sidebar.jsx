import { Calendar, Clock3, Users, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { APP_NAME, COMPANY, NAV_ITEMS, PROJECT_TAGLINE, USER } from "../../constants";

const iconMap = {
  Calendar,
  Clock3,
  Users,
};

const LinkItem = ({ item, className = "" }) => {
  const Icon = iconMap[item.icon];

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition duration-200 ${
          isActive
            ? "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
            : "text-[var(--brand-muted)] hover:bg-[var(--brand-bg)]"
        } ${className}`
      }
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-56 md:w-64 shrink-0 border-r border-[var(--brand-border)] bg-[var(--brand-card-bg)] md:flex md:flex-col transition-colors duration-300">
        <div className="border-b border-[var(--brand-border)] px-4 md:px-6 py-4 md:py-5 transition-colors duration-300">
          <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
            {COMPANY}
          </p>
          <h2 className="mt-2 text-base md:text-lg font-semibold text-[var(--brand-ink)]">
            {APP_NAME}
          </h2>
          <p className="mt-1 text-xs text-[var(--brand-muted)]">{PROJECT_TAGLINE}</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 md:p-4">
          {NAV_ITEMS.map((item) => (
            <LinkItem key={item.key} item={item} />
          ))}
        </nav>
        <div className="flex items-center gap-3 border-t border-[var(--brand-border)] p-3 md:p-4 transition-colors duration-300">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-sm font-semibold text-[var(--brand-primary)]">
            {USER.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--brand-ink)] truncate">
              {USER.name}
            </p>
            <p className="text-xs text-[var(--brand-muted)] truncate">
              {USER.email}
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="sticky top-16 z-10 md:hidden flex items-center justify-end border-b border-[var(--brand-border)] bg-[var(--brand-card-bg)] px-4 py-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="touch-target rounded-lg border border-[var(--brand-border)] hover:bg-[var(--brand-bg)]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className="fixed inset-0 top-16 z-20 md:hidden bg-[var(--brand-card-bg)] border-b border-[var(--brand-border)]">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto space-y-1 p-3">
            {NAV_ITEMS.map((item) => (
              <div key={item.key} onClick={() => setMobileMenuOpen(false)}>
                <LinkItem item={item} />
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--brand-border)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-sm font-semibold text-[var(--brand-primary)]">
                {USER.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--brand-ink)]">
                  {USER.name}
                </p>
                <p className="text-xs text-[var(--brand-muted)]">{USER.email}</p>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Bottom Navigation (compact) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--brand-border)] bg-[var(--brand-card-bg)] p-2 md:hidden transition-colors duration-300">
        <div className="grid grid-cols-3 gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <NavLink
                key={item.key}
                to={item.href}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center rounded-md py-2 text-[10px] font-medium transition duration-200 gap-1 ${
                    isActive
                      ? "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                      : "text-[var(--brand-muted)] hover:bg-[var(--brand-bg)]"
                  }`
                }
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
