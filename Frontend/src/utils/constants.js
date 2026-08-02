// Base URL for the existing Express/MongoDB backend.
// Override via VITE_API_BASE_URL in a .env file if needed.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const ROLES = {
  ADMIN: "admin",
};

export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};
