import { useCallback, useEffect, useState } from "react";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import PostCard from "../components/feed/PostCard";
import CreatePostModal from "../components/feed/CreatePostModal";
import EditPostModal from "../components/feed/EditPostModal";
import { deletePost, getPosts, updatePost } from "../api/post.api";
import { useToast } from "../hooks/useToast";
import { usePostUpload } from "../hooks/usePostUpload";

export default function Feed() {
  const toast = useToast();
  const { subscribeOnPostCreated } = usePostUpload();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const fetchPosts = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const { data } = await getPosts();
      setPosts(data?.posts || []);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load feed.";
      toast.error(message);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  // Listen for background uploads completing to update feed instantly
  useEffect(() => {
    const unsubscribe = subscribeOnPostCreated(() => {
      fetchPosts(false);
    });
    return unsubscribe;
  }, [subscribeOnPostCreated, fetchPosts]);

  const handleUpdatePost = async (postId, data) => {
    setIsSubmittingEdit(true);
    try {
      const res = await updatePost(postId, data);
      toast.success("Post updated!");
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, caption: res.data.post.caption } : p))
      );
      setEditingPost(null);
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update post.");
      return false;
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      toast.success("Post deleted.");
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete post.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Community Feed</h1>
          <p className="text-xs text-muted mt-0.5">Live updates and shared moments</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchPosts(false)}
            title="Refresh feed"
          >
            ↻ Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + New Post
          </Button>
        </div>
      </div>

      {/* Feed Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader size="lg" />
          <p className="text-xs text-muted">Loading latest posts...</p>
        </div>
      ) : !posts.length ? (
        <div className="card p-12 text-center flex flex-col items-center">
          <span className="text-4xl mb-3">🖼️</span>
          <h3 className="text-base font-semibold text-slate-100">No posts yet</h3>
          <p className="text-xs text-muted mt-1 max-w-xs">
            Be the first to share an image with the community.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create First Post
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDeletePost}
              onEdit={(p) => setEditingPost(p)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Modal */}
      <EditPostModal
        isOpen={Boolean(editingPost)}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        onSubmit={handleUpdatePost}
        isSubmitting={isSubmittingEdit}
      />
    </div>
  );
}
