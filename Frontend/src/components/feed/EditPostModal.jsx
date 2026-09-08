import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Textarea from "../common/Textarea";
import Button from "../common/Button";

export default function EditPostModal({
  isOpen,
  onClose,
  post,
  onSubmit,
  isSubmitting,
}) {
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (post) {
      setCaption(post.caption || "");
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) {
      setError("Caption cannot be empty.");
      return;
    }
    setError("");
    const success = await onSubmit?.(post._id, { caption: caption.trim() });
    if (success) {
      onClose?.();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post Caption">
      <form onSubmit={handleSubmit} className="space-y-4">
        {post?.image && (
          <div className="overflow-hidden rounded-lg max-h-40 border border-border bg-background">
            <img src={post.image} alt="Post preview" className="w-full h-40 object-cover opacity-70" />
          </div>
        )}

        <Textarea
          label="Caption"
          name="caption"
          placeholder="Update your caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          error={error}
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
