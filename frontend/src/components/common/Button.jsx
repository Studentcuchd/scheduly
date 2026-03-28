import { Loader2 } from "lucide-react";

const variantClasses = {
  primary: "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-deep)] border border-[var(--brand-primary)] transition-colors duration-200",
  secondary: "bg-transparent text-[var(--brand-primary)] border border-[var(--brand-primary)] hover:bg-[var(--brand-bg)] transition-colors duration-200",
  danger: "bg-[var(--brand-error)] text-white border border-[var(--brand-error)] hover:bg-red-600 transition-colors duration-200",
  ghost: "bg-transparent text-[var(--brand-muted)] border border-transparent hover:bg-[var(--brand-bg)] transition-colors duration-200",
};

const sizeClasses = {
  sm: "h-9 md:h-10 px-3 md:px-4 text-xs md:text-sm",
  md: "h-10 md:h-11 px-4 md:px-5 text-sm",
  lg: "h-11 md:h-12 px-5 md:px-6 text-base",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  children,
  className = "",
  icon: Icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-md ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {Icon && !loading && <Icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;
