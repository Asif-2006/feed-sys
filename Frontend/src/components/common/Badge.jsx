import { classNames } from "../../utils/helpers";

const VARIANTS = {
  primary: "bg-primary-light text-primary border-primary/20",
  success: "bg-success-light text-success border-success/20",
  danger: "bg-danger-light text-danger border-danger/20",
  warning: "bg-warning-light text-warning border-warning/20",
  muted: "bg-surface-hover text-slate-300 border-border",
};

export default function Badge({
  children,
  variant = "muted",
  className = "",
}) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant] || VARIANTS.muted,
        className
      )}
    >
      {children}
    </span>
  );
}
