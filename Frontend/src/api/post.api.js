import axiosInstance from "./axiosInstance";

export const getPosts = () => {
  return axiosInstance.get("/posts");
};

export const getPostById = (id) => {
  return axiosInstance.get(`/posts/${id}`);
};

export const createPost = (formData) => {
  return axiosInstance.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePost = (id, data) => {
  return axiosInstance.put(`/posts/${id}`, data);
};

export const deletePost = (id) => {
  return axiosInstance.delete(`/posts/${id}`);
};

export const toggleLikePost = (id) => {
  return axiosInstance.post(`/posts/${id}/like`);
};
