import { classNames } from "../../utils/helpers";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/30",
  secondary: "bg-surface-hover text-slate-200 hover:bg-surface-active border border-border hover:border-border-light",
  outline: "bg-transparent text-slate-300 hover:text-white hover:bg-surface-hover border border-border",
  danger: "bg-danger text-white hover:bg-danger-hover shadow-sm shadow-danger/30",
  ghost: "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-surface-hover",
};

const SIZES = {
  sm: "text-xs px-2.5 py-1.5 rounded-md gap-1.5",
  md: "text-sm px-4 py-2 rounded-lg gap-2",
  lg: "text-base px-5 py-2.5 rounded-lg gap-2.5",
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  icon = null,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classNames(
        "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
