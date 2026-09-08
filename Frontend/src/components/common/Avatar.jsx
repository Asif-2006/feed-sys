import { getInitials, classNames } from "../../utils/helpers";

const SIZES = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

export default function Avatar({
  profilePicture,
  name = "",
  size = "md",
  className = "",
}) {
  const dimension = SIZES[size] || SIZES.md;

  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={name || "User avatar"}
        className={classNames(
          dimension,
          "rounded-full object-cover ring-1 ring-border shrink-0 bg-surface",
          className
        )}
      />
    );
  }

  return (
    <div
      className={classNames(
        dimension,
        "rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-semibold ring-1 ring-border shrink-0 select-none shadow-sm",
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
