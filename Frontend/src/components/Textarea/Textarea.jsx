import { forwardRef } from "react";
import { classNames } from "../../utils/helpers";

const Textarea = forwardRef(function Textarea(
  { label, error, className = "", id, ...props },
  ref
) {
  const areaId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={areaId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        ref={ref}
        rows={4}
        className={classNames(
          "w-full resize-none rounded-xl border bg-base px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition duration-150 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none",
          error ? "border-danger" : "border-border",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default Textarea;
