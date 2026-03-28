import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { ASSIGNMENT_STAMP } from "../../constants";

const Header = ({ title, subtitle = "", actions }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-[var(--brand-border)] bg-[var(--brand-card-bg)]/90 px-4 py-3 backdrop-blur md:px-8 transition-colors duration-300">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg md:text-xl font-semibold text-[var(--brand-ink)] truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-[var(--brand-muted)] line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        {actions}
        <button
          onClick={toggleTheme}
          className="touch-target rounded-lg border border-[var(--brand-border)] hover:bg-[var(--brand-bg)] transition-colors duration-200"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 md:h-5 md:w-5 text-[var(--brand-muted)]" />
          ) : (
            <Sun className="h-5 w-5 md:h-5 md:w-5 text-[var(--brand-muted)]" />
          )}
        </button>
        <span className="hidden rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-[10px] md:text-[11px] font-semibold text-blue-600 dark:text-blue-300 lg:inline-flex whitespace-nowrap">
          {ASSIGNMENT_STAMP}
        </span>
      </div>
    </header>
  );
};

export default Header;
