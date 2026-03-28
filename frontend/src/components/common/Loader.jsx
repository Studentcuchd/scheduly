import { Loader2 } from "lucide-react";

const Loader = ({ fullPage = false, label = "Loading..." }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--brand-bg)]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-card-bg)] px-4 py-3 shadow-md transition-colors">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--brand-primary)]" />
          <span className="text-sm text-[var(--brand-muted)]">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-5 w-5 animate-spin text-[var(--brand-primary)]" />
    </div>
  );
};

export default Loader;
