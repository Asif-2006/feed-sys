import { useCallback, useRef, useState } from "react";

export default function ImageUploader({ onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) return;
      setPreview(URL.createObjectURL(file));
      onChange?.(file);
    },
    [onChange]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative w-full overflow-hidden rounded-xl border border-border bg-base">
          <img src={preview} alt="Selected upload" className="aspect-video w-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white hover:bg-black/80"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 text-sm transition duration-150 ${
            isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/60"
          }`}
        >
          <span className="text-2xl">🖼️</span>
          <span className="font-medium text-slate-300">Click or drag an image to upload</span>
        </button>
      )}
    </div>
  );
}
