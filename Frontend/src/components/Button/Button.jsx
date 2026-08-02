import { classNames } from "../../utils/helpers";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover disabled:bg-primary/40",
  secondary:
    "bg-surface text-slate-100 border border-border hover:border-slate-500 disabled:text-slate-500",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5 disabled:text-slate-600",
  danger: "bg-danger text-white hover:bg-danger-hover disabled:bg-danger/40",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl",
  lg: "text-base px-6 py-3 rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  type = "button",
  icon = null,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classNames(
        "inline-flex items-center justify-center gap-2 font-medium transition duration-150 disabled:cursor-not-allowed active:scale-[0.98]",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {!isLoading && icon}
      {children}
    </button>
  );
}
