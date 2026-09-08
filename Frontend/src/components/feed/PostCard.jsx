import { useState } from "react";
import Avatar from "../common/Avatar";
import { formatRelativeTime, getAuthorDisplayName, getUserId } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";
import { toggleLikePost } from "../../api/post.api";

export default function PostCard({ post, onDelete, onEdit }) {
  const { user, isAdmin } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = getUserId(user);
  const authorId = getUserId(post?.author);
  const isOwner = Boolean(currentUserId && authorId && currentUserId === authorId);
  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  // Likes state
  const initialLikes = Array.isArray(post.likes) ? post.likes : [];
  const initialIsLiked = initialLikes.some(
    (id) => (typeof id === "object" ? id?._id : id) === currentUserId
  );

  const [likesCount, setLikesCount] = useState(initialLikes.length);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const handleToggleLike = async () => {
    if (isLiking || !currentUserId) return;
    setIsLiking(true);

    const prevLiked = isLiked;
    const prevCount = likesCount;

    // Optimistic update
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    if (!prevLiked) {
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 500);
    }

    try {
      const { data } = await toggleLikePost(post._id);
      if (typeof data.isLiked === "boolean") {
        setIsLiked(data.isLiked);
      }
      if (typeof data.likesCount === "number") {
        setLikesCount(data.likesCount);
      }
    } catch {
      // Revert on error
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDoubleClickImage = () => {
    if (!isLiked) {
      handleToggleLike();
    } else {
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 500);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setIsDeleting(true);
    try {
      await onDelete?.(post._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="card transition-all duration-150 hover:border-border-light overflow-hidden max-w-xl mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            profilePicture={post.author?.profilePicture}
            name={getAuthorDisplayName(post.author)}
            size="md"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">
              {getAuthorDisplayName(post.author)}
            </p>
            <p className="text-xs text-muted">{formatRelativeTime(post.createdAt)}</p>
          </div>
        </div>

        {(canEdit || canDelete) && (
          <div className="flex items-center gap-1 shrink-0">
            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(post)}
                className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-surface-hover transition-colors"
                title="Edit caption"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-medium text-slate-400 hover:text-danger px-2 py-1 rounded hover:bg-danger-light transition-colors disabled:opacity-50"
                title="Delete post"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </header>

      {/* Post Image with double-click to like */}
      {post.image && (
        <div
          className="relative w-full h-80 sm:h-96 md:h-[420px] bg-background flex items-center justify-center overflow-hidden select-none cursor-pointer"
          onDoubleClick={handleDoubleClickImage}
        >
          <img
            src={post.image}
            alt="Post media"
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Floating Heart Animation on Like */}
          {heartPop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-scale-in">
              <span className="text-6xl text-danger drop-shadow-lg filter">
                ❤️
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer / Interaction Bar */}
      <div className="p-4 pt-3 space-y-2.5">
        {/* Like Button & Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 text-sm font-medium transition-transform duration-150 active:scale-90 ${
              isLiked ? "text-danger" : "text-slate-400 hover:text-slate-200"
            }`}
            title={isLiked ? "Unlike" : "Like"}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isLiked ? "fill-danger stroke-danger" : "fill-none stroke-current"
              }`}
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-xs font-semibold select-none">
              {likesCount} {likesCount === 1 ? "like" : "likes"}
            </span>
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-200">
            {post.caption}
          </p>
        )}
      </div>
    </article>
  );
}
