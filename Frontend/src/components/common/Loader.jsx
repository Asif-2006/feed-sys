import { classNames } from "../../utils/helpers";

const SIZES = {
  sm: "h-4 w-4 border-2",
  md: "h-7 w-7 border-2",
  lg: "h-10 w-10 border-3",
};

export default function Loader({ size = "md", className = "" }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={classNames(
        "rounded-full border-border border-t-primary animate-spin shrink-0",
        SIZES[size] || SIZES.md,
        className
      )}
    />
  );
}
