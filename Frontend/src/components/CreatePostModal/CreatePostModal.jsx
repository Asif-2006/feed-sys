import { useState } from "react";
import Modal from "../Modal/Modal";
import Textarea from "../Textarea/Textarea";
import Button from "../Button/Button";
import ImageUploader from "../ImageUploader/ImageUploader";

export default function CreatePostModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !image) {
      setError("Add a caption or an image before posting.");
      return;
    }
    setError("");
    await onSubmit?.({ caption: caption.trim(), image });
    setCaption("");
    setImage(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create post">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          name="caption"
          placeholder="Write a caption…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <ImageUploader onChange={setImage} />

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Publish
          </Button>
        </div>
      </form>
    </Modal>
  );
}
