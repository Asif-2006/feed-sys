import axiosInstance from "./axiosInstance";

// POST /auth/register
// Body: { username, email, password }
// Response: { message }
export const registerUser = ({ username, email, password }) => {
  return axiosInstance.post("/auth/register", { username, email, password });
};

// POST /auth/login
// Body: { email, password }
// Sets an httpOnly cookie. No token is returned in the response body.
export const loginUser = ({ email, password }) => {
  return axiosInstance.post("/auth/login", { email, password });
};

// POST /auth/logout
export const logoutUser = () => {
  return axiosInstance.post("/auth/logout");
};

// GET /auth/me
// Response: { user }
export const getCurrentUser = () => {
  return axiosInstance.get("/auth/me");
};

// No endpoint was provided for editing a profile (PUT/PATCH /auth/me or
// similar). Per spec, profile editing is not implemented in the UI.
