import Avatar from "../Avatar/Avatar";
import { formatRelativeTime, getAuthorDisplayName } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const isOwner = user?._id === post.author?._id;

  return (
    <article className="card p-4 sm:p-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            profilePicture={post.author?.profilePicture}
            name={getAuthorDisplayName(post.author)}
          />
          <div>
            <p className="text-sm font-semibold text-slate-100">
              {getAuthorDisplayName(post.author)}
            </p>
            <p className="text-xs text-muted">{formatRelativeTime(post.createdAt)}</p>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={() => onDelete?.(post._id)}
            className="text-xs font-medium text-muted hover:text-danger"
          >
            Delete
          </button>
        )}
      </header>

      {post.caption && (
        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-200">
          {post.caption}
        </p>
      )}

      {post.image && (
        <div className="mt-4 w-full overflow-hidden rounded-xl bg-base">
          <img
            src={post.image}
            alt="Post"
            className="aspect-[4/3] w-full object-cover sm:aspect-video"
            loading="lazy"
          />
        </div>
      )}
    </article>
  );
}
