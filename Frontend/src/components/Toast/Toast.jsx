import { classNames } from "../../utils/helpers";

const STYLES = {
  success: "border-l-4 border-success",
  error: "border-l-4 border-danger",
  info: "border-l-4 border-accent",
};

const ICONS = {
  success: "✓",
  error: "!",
  info: "i",
};

export default function Toast({ message, type = "info", onClose }) {
  return (
    <div
      role="alert"
      className={classNames(
        "flex items-center gap-3 rounded-xl bg-surface border border-border px-4 py-3 text-sm text-slate-100 shadow-lg shadow-black/30 min-w-[240px] max-w-sm",
        STYLES[type]
      )}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
        {ICONS[type]}
      </span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-slate-500 hover:text-slate-200" aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
