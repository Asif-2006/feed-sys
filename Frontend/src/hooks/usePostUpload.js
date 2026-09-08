import { useContext } from "react";
import { PostUploadContext } from "../context/PostUploadContext";

export function usePostUpload() {
  const context = useContext(PostUploadContext);
  if (!context) {
    throw new Error("usePostUpload must be used within a PostUploadProvider");
  }
  return context;
}
