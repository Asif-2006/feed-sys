import axiosInstance from "./axiosInstance";

export const blockUser = (userId, reason) => {
  return axiosInstance.patch(`/admin/user/block/${userId}`, { reason });
};

export const unblockUser = (userId) => {
  return axiosInstance.patch(`/admin/user/unblock/${userId}`);
};

export const getBlockedWords = () => {
  return axiosInstance.get("/admin/blocked-words");
};

export const addBlockedWord = ({ word, category, severity }) => {
  return axiosInstance.post("/admin/blocked-words", { word, category, severity });
};

export const updateBlockedWord = (id, data) => {
  return axiosInstance.patch(`/admin/blocked-words/${id}`, data);
};

export const deleteBlockedWord = (id) => {
  return axiosInstance.delete(`/admin/blocked-words/${id}`);
};
