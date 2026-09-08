export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const USER_STATUS = {
  ACTIVE: "active",
  BLOCKED: "blocked",
};

export const POSTING_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
};

export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};
