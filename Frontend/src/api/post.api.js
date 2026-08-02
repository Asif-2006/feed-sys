import axiosInstance from "./axiosInstance";

// GET /posts
// Response: { posts: [{ _id, author, image, imageFileId, caption, createdAt, updatedAt }] }
export const getPosts = () => {
  return axiosInstance.get("/posts");
};

// POST /posts (multipart/form-data)
// Fields: caption, image
export const createPost = (formData) => {
  return axiosInstance.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE /posts/:id
export const deletePost = (postId) => {
  return axiosInstance.delete(`/posts/${postId}`);
};

// No endpoints were provided for likes, comments, follow, single-post
// fetch, or user profile lookup — none of that is implemented here.
