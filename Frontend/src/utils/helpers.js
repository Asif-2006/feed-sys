export function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 30) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const intervals = [
    { label: "y", secs: 31536000 },
    { label: "mo", secs: 2592000 },
    { label: "d", secs: 86400 },
    { label: "h", secs: 3600 },
    { label: "m", secs: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.secs);
    if (count >= 1) {
      return `${count}${interval.label} ago`;
    }
  }
  return "just now";
}

export function getInitials(name = "") {
  if (!name) return "U";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getAuthorDisplayName(author) {
  if (!author) return "Anonymous";
  if (typeof author === "string") return author;
  return author.fullName?.trim() ? author.fullName : (author.username || "Anonymous");
}

export function getUserId(user) {
  if (!user) return null;
  return user._id || user.id || null;
}
