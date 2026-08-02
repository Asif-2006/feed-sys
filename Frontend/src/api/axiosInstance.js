import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// Auth is cookie-based only (httpOnly cookie set by POST /auth/login).
// Do NOT store a JWT in localStorage and do NOT attach an Authorization header.
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
