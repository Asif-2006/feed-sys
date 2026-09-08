import { usePostUpload } from "../../hooks/usePostUpload";
import Button from "../common/Button";

export default function UploadTaskWidget() {
  const { tasks, retryTask, dismissTask } = usePostUpload();

  if (!tasks.length) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9990] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {tasks.map((task) => {
        const isError = task.status === "error";
        const isSuccess = task.status === "success";

        return (
          <div
            key={task.id}
            className={`pointer-events-auto card p-3.5 shadow-2xl border transition-all duration-200 animate-slide-down bg-surface ${
              isError
                ? "border-danger/60 bg-surface shadow-danger/10"
                : isSuccess
                ? "border-success/60 bg-surface shadow-success/10"
                : "border-primary/50 shadow-primary/10"
            }`}
          >
            {/* Header / Thumbnail + Status */}
            <div className="flex items-center gap-3">
              {task.previewUrl && (
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-background border border-border">
                  <img
                    src={task.previewUrl}
                    alt="Upload thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-100 truncate">
                    {isSuccess
                      ? "Post Published!"
                      : isError
                      ? "Publish Failed"
                      : "Publishing Post..."}
                  </p>
                  <span className="text-[11px] font-mono text-muted shrink-0">
                    {task.progress}%
                  </span>
                </div>

                <p className="text-[11px] text-muted truncate mt-0.5">
                  {task.error || task.statusText}
                </p>
              </div>

              {isSuccess && (
                <span className="text-success font-bold text-base shrink-0">✓</span>
              )}
            </div>

            {/* Simulated Animated Progress Bar */}
            <div className="w-full bg-background rounded-full h-1.5 mt-2.5 overflow-hidden border border-border/50">
              <div
                className={`h-full transition-all duration-200 rounded-full ${
                  isError
                    ? "bg-danger"
                    : isSuccess
                    ? "bg-success"
                    : "bg-gradient-to-r from-primary via-accent to-primary animate-pulse"
                }`}
                style={{ width: `${task.progress}%` }}
              />
            </div>

            {/* Error Actions (Retry / Dismiss) */}
            {isError && (
              <div className="flex items-center justify-end gap-2 mt-2.5 pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissTask(task.id)}
                  className="text-xs text-slate-400 hover:text-slate-200 py-1 px-2"
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => retryTask(task.id)}
                  className="text-xs py-1 px-2.5"
                >
                  ↻ Retry Upload
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
