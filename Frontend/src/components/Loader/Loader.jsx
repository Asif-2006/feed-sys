import { classNames } from "../../utils/helpers";

export default function Loader({ size = "md", className = "" }) {
  const dimension = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" }[size] || "h-8 w-8";

  return (
    <div
      role="status"
      aria-label="Loading"
      className={classNames(
        dimension,
        "rounded-full border-[3px] border-border border-t-primary animate-spin",
        className
      )}
    />
  );
}
