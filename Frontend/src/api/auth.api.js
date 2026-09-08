import axiosInstance from "./axiosInstance";

export const registerUser = ({ username, email, password }) => {
  return axiosInstance.post("/auth/register", { username, email, password });
};

export const loginUser = ({ email, username, password }) => {
  return axiosInstance.post("/auth/login", { email, username, password });
};

export const logoutUser = () => {
  return axiosInstance.post("/auth/logout");
};

export const getCurrentUser = () => {
  return axiosInstance.get("/auth/me");
};
