import { getInitials, classNames } from "../../utils/helpers";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

// Field is `profilePicture`, not `avatarUrl`, per the backend contract.
export default function Avatar({ profilePicture, name = "", size = "md", className = "" }) {
  const dimension = SIZES[size] || SIZES.md;

  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={name || "User avatar"}
        className={classNames(dimension, "rounded-full object-cover ring-2 ring-border", className)}
      />
    );
  }

  return (
    <div
      className={classNames(
        dimension,
        "rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-semibold ring-2 ring-border",
        className
      )}
    >
      {getInitials(name) || "?"}
    </div>
  );
}
