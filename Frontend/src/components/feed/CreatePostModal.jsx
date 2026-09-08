import { useRef, useState, useEffect } from "react";
import Modal from "../common/Modal";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import { usePostUpload } from "../../hooks/usePostUpload";

const ASPECT_RATIOS = [
  { label: "Original", value: "original" },
  { label: "1:1 Square", value: "1:1", ratio: 1 },
  { label: "4:5 Portrait", value: "4:5", ratio: 4 / 5 },
  { label: "16:9 Wide", value: "16:9", ratio: 16 / 9 },
];

export default function CreatePostModal({
  isOpen,
  onClose,
}) {
  const { startUpload } = usePostUpload();
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef(null);
  const previewBoxRef = useRef(null);

  // Dimension, Pan & Zoom State
  const [aspectRatio, setAspectRatio] = useState("original");
  const [zoom, setZoom] = useState(1); // 0.5 to 3.0
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Filters & Transform State
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [grayscale, setGrayscale] = useState(false);
  const [activeTab, setActiveTab] = useState("crop"); // "crop" | "adjust" | "filters"

  const resetEditing = () => {
    setAspectRatio("original");
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setFlipH(false);
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setGrayscale(false);
  };

  const resetForm = () => {
    setCaption("");
    setImageFile(null);
    setImagePreview(null);
    setError("");
    resetEditing();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Image size must be less than 12MB.");
      return;
    }
    setError("");
    resetEditing();
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Mouse & Touch Pan Handling
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    setIsPanning(true);
    setPanStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Wheel to Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(3.0, Math.max(0.5, Number((prev + delta).toFixed(2)))));
  };

  useEffect(() => {
    const box = previewBoxRef.current;
    if (!box) return;

    const onWheelPrevent = (e) => e.preventDefault();
    box.addEventListener("wheel", onWheelPrevent, { passive: false });
    return () => box.removeEventListener("wheel", onWheelPrevent);
  }, [imagePreview]);

  const getCssFilter = () => {
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) ${
      grayscale ? "grayscale(100%)" : ""
    }`.trim();
  };

  const getCssTransform = () => {
    const scaleX = flipH ? -1 : 1;
    return `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${scaleX})`;
  };

  // Generate processed canvas image blob before submission
  const processImageToBlob = () => {
    return new Promise((resolve) => {
      if (!imagePreview) return resolve(imageFile);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagePreview;

      img.onload = () => {
        const box = previewBoxRef.current;
        const boxWidth = box ? box.clientWidth : 500;
        const boxHeight = box ? box.clientHeight : 400;

        let targetWidth = 1080;
        let targetHeight = 1080;

        const selectedAspect = ASPECT_RATIOS.find((a) => a.value === aspectRatio);
        if (selectedAspect && selectedAspect.ratio) {
          if (selectedAspect.ratio >= 1) {
            targetWidth = 1080;
            targetHeight = Math.round(1080 / selectedAspect.ratio);
          } else {
            targetHeight = 1080;
            targetWidth = Math.round(1080 * selectedAspect.ratio);
          }
        } else {
          // Original aspect
          targetWidth = img.naturalWidth;
          targetHeight = img.naturalHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) ${
          grayscale ? "grayscale(100%)" : ""
        }`.trim();

        // Fill background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        // Translate to center + apply normalized pan offsets
        const panRatioX = canvas.width / boxWidth;
        const panRatioY = canvas.height / boxHeight;

        ctx.translate(
          canvas.width / 2 + pan.x * panRatioX,
          canvas.height / 2 + pan.y * panRatioY
        );

        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale((flipH ? -1 : 1) * zoom, zoom);

        // Fit image naturally relative to canvas
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        let drawW, drawH;

        if (imgRatio > canvasRatio) {
          drawW = canvas.width;
          drawH = canvas.width / imgRatio;
        } else {
          drawH = canvas.height;
          drawW = canvas.height * imgRatio;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(imageFile);
            const originalName = imageFile.name || "photo";
            const cleanName = originalName.replace(/\.[^/.]+$/, "") + ".jpg";
            const processedFile = new File([blob], cleanName, {
              type: "image/jpeg",
            });
            resolve(processedFile);
          },
          "image/jpeg",
          0.92
        );
      };

      img.onerror = () => resolve(imageFile);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("An image is required to publish a post.");
      return;
    }
    setError("");

    // Only process through canvas if user adjusted size, pan, aspect ratio, or filters
    const hasEdits =
      aspectRatio !== "original" ||
      zoom !== 1 ||
      pan.x !== 0 ||
      pan.y !== 0 ||
      rotation !== 0 ||
      flipH ||
      brightness !== 100 ||
      contrast !== 100 ||
      saturate !== 100 ||
      grayscale;

    const fileToUpload = hasEdits ? await processImageToBlob() : imageFile;
    const previewToKeep = imagePreview;

    startUpload({
      caption: caption.trim(),
      image: fileToUpload,
      previewUrl: previewToKeep,
    });

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Post"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload & Editor View */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {imagePreview ? (
            <div className="space-y-3">
              {/* Interactive Drag to Reposition & Resize Box */}
              <div
                ref={previewBoxRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className={`relative w-full bg-black/90 rounded-xl overflow-hidden flex items-center justify-center border border-border transition-all duration-150 select-none ${
                  isPanning ? "cursor-grabbing" : "cursor-grab"
                } ${
                  aspectRatio === "1:1"
                    ? "aspect-square max-h-[380px]"
                    : aspectRatio === "4:5"
                    ? "aspect-[4/5] max-h-[420px]"
                    : aspectRatio === "16:9"
                    ? "aspect-video max-h-[320px]"
                    : "h-72 max-h-[320px]"
                }`}
              >
                <img
                  src={imagePreview}
                  alt="Selected upload"
                  draggable={false}
                  style={{
                    filter: getCssFilter(),
                    transform: getCssTransform(),
                  }}
                  className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-75"
                />

                {/* Framing Overlay Hint */}
                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl flex items-center justify-center">
                  <div className="absolute top-2 left-2 text-[10px] bg-black/60 text-slate-300 px-2 py-0.5 rounded backdrop-blur-sm">
                    Drag to move • Scroll to zoom ({(zoom * 100).toFixed(0)}%)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    resetEditing();
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2.5 right-2.5 rounded-md bg-black/80 px-2.5 py-1 text-xs font-medium text-white hover:bg-black transition-colors z-10"
                >
                  Change Image
                </button>
              </div>

              {/* Editing Controls Toolbar */}
              <div className="card p-3 space-y-3 bg-surface border-border">
                {/* Control Tabs */}
                <div className="flex items-center justify-between border-b border-border pb-2 text-xs font-semibold">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab("crop")}
                      className={`transition-colors ${
                        activeTab === "crop" ? "text-primary" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      📐 Size & Dimensions
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("adjust")}
                      className={`transition-colors ${
                        activeTab === "adjust" ? "text-primary" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      🔍 Resize & Zoom
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("filters")}
                      className={`transition-colors ${
                        activeTab === "filters" ? "text-primary" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      🎨 Filters
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={resetEditing}
                    className="text-slate-400 hover:text-danger text-[11px] font-medium"
                  >
                    Reset All
                  </button>
                </div>

                {/* Tab: Size & Dimensions */}
                {activeTab === "crop" && (
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-xs text-muted block mb-1.5 font-medium">
                        Aspect Ratio Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {ASPECT_RATIOS.map((ratio) => (
                          <button
                            key={ratio.value}
                            type="button"
                            onClick={() => setAspectRatio(ratio.value)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              aspectRatio === ratio.value
                                ? "bg-primary text-white"
                                : "bg-surface-hover text-slate-300 hover:bg-surface-active"
                            }`}
                          >
                            {ratio.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      >
                        ↻ Rotate 90°
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setFlipH((prev) => !prev)}
                      >
                        ⇄ Flip Horizontal
                      </Button>
                    </div>
                  </div>
                )}

                {/* Tab: Resize & Zoom */}
                {activeTab === "adjust" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-16 text-muted">Scale / Size:</span>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="flex-1 accent-primary h-1.5 bg-border rounded-lg"
                      />
                      <span className="w-12 text-right text-slate-300 font-mono">
                        {(zoom * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setZoom((prev) => Math.max(0.5, Number((prev - 0.2).toFixed(2))))}
                        >
                          - Smaller
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setZoom((prev) => Math.min(3.0, Number((prev + 0.2).toFixed(2))))}
                        >
                          + Bigger
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setZoom(1);
                          setPan({ x: 0, y: 0 });
                        }}
                      >
                        Recenter Image
                      </Button>
                    </div>
                  </div>
                )}

                {/* Tab: Adjustments & Filters */}
                {activeTab === "filters" && (
                  <div className="space-y-2.5">
                    {/* Brightness */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-20 text-muted">Brightness:</span>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="flex-1 accent-primary h-1.5 bg-border rounded-lg"
                      />
                      <span className="w-8 text-right text-slate-300 font-mono">
                        {brightness}%
                      </span>
                    </div>

                    {/* Contrast */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-20 text-muted">Contrast:</span>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="flex-1 accent-primary h-1.5 bg-border rounded-lg"
                      />
                      <span className="w-8 text-right text-slate-300 font-mono">
                        {contrast}%
                      </span>
                    </div>

                    {/* Saturation */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-20 text-muted">Saturation:</span>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturate}
                        onChange={(e) => setSaturate(Number(e.target.value))}
                        className="flex-1 accent-primary h-1.5 bg-border rounded-lg"
                      />
                      <span className="w-8 text-right text-slate-300 font-mono">
                        {saturate}%
                      </span>
                    </div>

                    {/* Grayscale toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted">Black & White Mode:</span>
                      <button
                        type="button"
                        onClick={() => setGrayscale((prev) => !prev)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          grayscale
                            ? "bg-primary text-white"
                            : "bg-surface-hover text-slate-300 hover:bg-surface-active"
                        }`}
                      >
                        {grayscale ? "Enabled" : "Disabled"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleFileDrop}
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                isDraggingFile
                  ? "border-primary bg-primary-light"
                  : "border-border hover:border-border-light bg-surface"
              }`}
            >
              <span className="text-4xl mb-2">📸</span>
              <p className="text-sm font-semibold text-slate-200">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted mt-1">PNG, JPG, or WEBP up to 12MB</p>
            </div>
          )}
        </div>

        {/* Caption */}
        <Textarea
          label="Caption (Optional)"
          name="caption"
          placeholder="Share your thoughts or describe this image..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
        />

        {error && (
          <div className="p-3.5 rounded-lg bg-danger-light border border-danger/40 flex items-start gap-3 text-xs text-danger animate-fade-in">
            <span className="font-bold text-sm shrink-0 mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-100">Upload Failed</p>
              <p className="mt-0.5 text-danger leading-relaxed break-words">{error}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Publish Post
          </Button>
        </div>
      </form>
    </Modal>
  );
}
