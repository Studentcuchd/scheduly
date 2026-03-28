import { useEffect, useMemo } from "react";
import { X } from "lucide-react";

const widthClass = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const modalClass = useMemo(() => widthClass[size] || widthClass.md, [size]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4 transition-colors">
      <button
        type="button"
        aria-label="Close modal overlay"
        onClick={onClose}
        className="absolute inset-0"
      />
      <div className={`relative z-10 w-full ${modalClass} overflow-hidden rounded-t-2xl border border-[var(--brand-border)] bg-[var(--brand-card-bg)] shadow-[0_28px_80px_rgba(2,6,23,0.45)] animate-[fadeIn_0.2s_ease-out] sm:rounded-2xl transition-colors`}>
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#0f6fff] via-[#00a2ff] to-[#00a86b]" />
        <div className="flex items-center justify-between border-b border-[var(--brand-border)] px-4 md:px-6 py-4 pt-5 transition-colors">
          <h2 className="text-lg font-semibold text-[var(--brand-ink)]">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-2 hover:bg-[var(--brand-bg)] transition-colors">
            <X className="h-4 w-4 text-[var(--brand-muted)]" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-auto p-4 md:p-6 text-[var(--brand-ink)] transition-colors">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
