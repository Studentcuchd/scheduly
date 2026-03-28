import { ChevronDown } from "lucide-react";

const Select = ({
  options = [],
  value = "",
  onChange,
  disabled = false,
  className = "",
  label,
  required = false,
  error,
  placeholder = "Select an option",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
          {label}
          {required && <span className="text-[var(--brand-error)]">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-3 md:px-4 py-2 md:py-3
            bg-[var(--brand-bg)]
            border border-[var(--brand-border)]
            rounded-lg
            text-[var(--brand-ink)]
            appearance-none
            cursor-pointer
            transition-all duration-200
            focus:outline-none
            focus:border-[var(--brand-primary)]
            focus:ring-2
            focus:ring-[var(--brand-primary)]/10
            disabled:opacity-50
            disabled:cursor-not-allowed
            text-sm md:text-base
            pr-10
            ${error ? "border-[var(--brand-error)] focus:ring-[var(--brand-error)]/10" : ""}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--brand-muted)] pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-xs md:text-sm text-[var(--brand-error)]">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
