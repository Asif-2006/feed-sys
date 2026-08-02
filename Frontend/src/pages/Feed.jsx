import { useEffect, useState } from "react";
import Button from "../components/Button/Button";
import PostCard from "../components/PostCard/PostCard";
import CreatePostModal from "../components/CreatePostModal/CreatePostModal";
import Loader from "../components/Loader/Loader";
import { createPost, deletePost, getPosts } from "../api/post.api";
import { useToast } from "../hooks/useToast";

export default function Feed() {
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await getPosts();
      setPosts(data?.posts ?? []);
    } catch {
      toast.error("Couldn't load the feed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async ({ caption, image }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (image) formData.append("image", image);
      await createPost(formData);
      setIsModalOpen(false);
      toast.success("Post published");
      // Re-fetch rather than assuming the response shape of a single
      // created post, since only GET /posts' shape was documented.
      loadPosts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't publish this post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    const prevPosts = posts;
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    try {
      await deletePost(postId);
      toast.success("Post deleted");
    } catch {
      toast.error("Couldn't delete this post.");
      setPosts(prevPosts);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-100">Feed</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ New post</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : !posts.length ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-muted">
            Nothing here yet. Be the first to share something with your community.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
