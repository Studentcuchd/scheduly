const variantClass = {
  upcoming: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700",
  past: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700",
};

const Badge = ({ variant = "upcoming", label }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${variantClass[variant]}`}>
      {label}
    </span>
  );
};

export default Badge;
