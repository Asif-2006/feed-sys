import { forwardRef } from "react";
import { classNames } from "../../utils/helpers";

const Input = forwardRef(function Input(
  { label, error, helperText, className = "", id, name, ...props },
  ref
) {
  const inputId = id || name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        className={classNames(
          "w-full rounded-lg border bg-surface px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 outline-none focus:border-primary focus:ring-1 focus:ring-primary",
          error ? "border-danger focus:border-danger focus:ring-danger" : "border-border",
          className
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-danger">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-muted">{helperText}</span>
      ) : null}
    </div>
  );
});

export default Input;
