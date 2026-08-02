import axiosInstance from "./axiosInstance";

// PATCH /admin/user/block/:id
// Body: { reason }
export const blockUser = (userId, reason) => {
  return axiosInstance.patch(`/admin/user/block/${userId}`, { reason });
};

// PATCH /admin/user/unblock/:id
export const unblockUser = (userId) => {
  return axiosInstance.patch(`/admin/user/unblock/${userId}`);
};

// GET /admin/blocked-words
export const getBlockedWords = () => {
  return axiosInstance.get("/admin/blocked-words");
};

// POST /admin/blocked-words
// Body: { word }
export const addBlockedWord = (word) => {
  return axiosInstance.post("/admin/blocked-words", { word });
};

// DELETE /admin/blocked-words/:id
export const deleteBlockedWord = (wordId) => {
  return axiosInstance.delete(`/admin/blocked-words/${wordId}`);
};

// TODO: No GET /admin/users (or similar list) endpoint was provided, so
// there is currently no way to fetch a list of users to block/unblock from
// the UI. The Manage Users page below only supports blocking/unblocking by
// a manually entered user ID. Wire this up to a real list endpoint once
// one exists on the backend.
