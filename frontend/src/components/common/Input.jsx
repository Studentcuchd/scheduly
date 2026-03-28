const Input = ({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  disabled = false,
  className = "",
  label,
  required = false,
  error,
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
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-3 md:px-4 py-2 md:py-3
          bg-[var(--brand-bg)]
          border border-[var(--brand-border)]
          rounded-lg
          text-[var(--brand-ink)]
          placeholder-[var(--brand-muted)]
          transition-all duration-200
          focus:outline-none
          focus:border-[var(--brand-primary)]
          focus:ring-2
          focus:ring-[var(--brand-primary)]/10
          disabled:opacity-50
          disabled:cursor-not-allowed
          text-sm md:text-base
          ${error ? "border-[var(--brand-error)] focus:ring-[var(--brand-error)]/10" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs md:text-sm text-[var(--brand-error)]">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
