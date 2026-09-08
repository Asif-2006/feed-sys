import { createContext, useCallback, useState, useRef } from "react";
import { createPost } from "../api/post.api";
import { useToast } from "../hooks/useToast";

export const PostUploadContext = createContext(null);

let uploadIdCounter = 0;

export function PostUploadProvider({ children }) {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const onPostCreatedCallbacks = useRef(new Set());

  // Allow Feed or other components to listen for successfully published posts
  const subscribeOnPostCreated = useCallback((callback) => {
    onPostCreatedCallbacks.current.add(callback);
    return () => {
      onPostCreatedCallbacks.current.delete(callback);
    };
  }, []);

  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const startUpload = useCallback(
    async ({ caption, image, previewUrl }) => {
      const taskId = ++uploadIdCounter;
      const initialTask = {
        id: taskId,
        caption,
        image,
        previewUrl,
        progress: 12,
        status: "uploading", // "uploading" | "success" | "error"
        statusText: "Optimizing image...",
        error: null,
      };

      setTasks((prev) => [initialTask, ...prev]);

      // Simulated smooth progress phases while real API call runs
      let currentProgress = 12;
      const progressTimer = setInterval(() => {
        if (currentProgress < 35) {
          currentProgress += 5;
          updateTask(taskId, {
            progress: currentProgress,
            statusText: "Verifying community safety...",
          });
        } else if (currentProgress < 72) {
          currentProgress += 4;
          updateTask(taskId, {
            progress: currentProgress,
            statusText: "Uploading to cloud storage...",
          });
        } else if (currentProgress < 92) {
          currentProgress += 2;
          updateTask(taskId, {
            progress: currentProgress,
            statusText: "Finalizing post...",
          });
        }
      }, 140);

      try {
        const formData = new FormData();
        if (caption) formData.append("caption", caption);
        if (image) formData.append("image", image);

        const response = await createPost(formData);
        clearInterval(progressTimer);

        // Instant completion to 100%
        updateTask(taskId, {
          progress: 100,
          status: "success",
          statusText: "Post published!",
        });

        toast.success("Post published successfully!");

        // Notify listeners (e.g. Feed timeline)
        onPostCreatedCallbacks.current.forEach((cb) => {
          try {
            cb(response.data?.post);
          } catch (err) {
            console.error("Callback error:", err);
          }
        });

        // Auto remove task card after 3 seconds
        setTimeout(() => {
          removeTask(taskId);
        }, 3200);

        return { success: true };
      } catch (err) {
        clearInterval(progressTimer);
        const resp = err?.response?.data;
        let errorMsg = "Upload failed. Please check guidelines.";

        if (resp?.violations?.length) {
          const reasons = resp.violations
            .map((v) => `${v.type.toUpperCase()}: ${v.reasons.join(", ")}`)
            .join(" | ");
          errorMsg = `Violation: ${reasons}`;
        } else if (resp?.reason) {
          errorMsg = `Suspended: ${resp.reason}`;
        } else if (resp?.message) {
          errorMsg = resp.message;
        }

        updateTask(taskId, {
          progress: 100,
          status: "error",
          statusText: "Failed to publish",
          error: errorMsg,
        });

        toast.error(errorMsg, 6000);
        return { success: false, error: errorMsg };
      }
    },
    [removeTask, toast]
  );

  const retryTask = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      removeTask(taskId);
      startUpload({
        caption: task.caption,
        image: task.image,
        previewUrl: task.previewUrl,
      });
    },
    [tasks, removeTask, startUpload]
  );

  const value = {
    tasks,
    startUpload,
    retryTask,
    dismissTask: removeTask,
    subscribeOnPostCreated,
  };

  return (
    <PostUploadContext.Provider value={value}>
      {children}
    </PostUploadContext.Provider>
  );
}
