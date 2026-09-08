import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Loader from "../common/Loader";
import Badge from "../common/Badge";

export default function BlockedWordTable({
  words = [],
  isLoading,
  onAdd,
  onRemove,
  isAdding,
}) {
  const [newWord, setNewWord] = useState("");
  const [category, setCategory] = useState("general");
  const [severity, setSeverity] = useState("medium");
  const [search, setSearch] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = newWord.trim();
    if (!trimmed) return;
    onAdd?.({
      word: trimmed,
      category: category.trim() || "general",
      severity,
    });
    setNewWord("");
  };

  const filteredWords = words.filter((item) => {
    const wordText = item?.word || "";
    return wordText.toLowerCase().includes(search.toLowerCase());
  });

  const getSeverityBadgeVariant = (sev) => {
    switch (sev?.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "muted";
    }
  };

  return (
    <div className="space-y-5">
      {/* Add New Blocked Word Form */}
      <form
        onSubmit={handleAdd}
        className="card p-4 flex flex-col sm:flex-row items-end gap-3"
      >
        <div className="flex-1 w-full">
          <Input
            label="New Blocked Word"
            name="newWord"
            placeholder="e.g. spam, vulgarity..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-36">
          <label className="text-xs font-medium text-slate-300 mb-1.5 block">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
          >
            <option value="general">General</option>
            <option value="hate_speech">Hate Speech</option>
            <option value="harassment">Harassment</option>
            <option value="spam">Spam</option>
            <option value="profanity">Profanity</option>
          </select>
        </div>

        <div className="w-full sm:w-32">
          <label className="text-xs font-medium text-slate-300 mb-1.5 block">
            Severity
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Button type="submit" isLoading={isAdding} className="w-full sm:w-auto shrink-0">
          Add Word
        </Button>
      </form>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="Search words..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted">
          Total: <span className="font-semibold text-slate-200">{words.length}</span>
        </p>
      </div>

      {/* Words List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader size="md" />
        </div>
      ) : !filteredWords.length ? (
        <div className="card p-8 text-center text-muted text-sm">
          {search ? "No blocked words match your search." : "No blocked words found in database."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filteredWords.map((item) => (
            <div
              key={item._id || item.word}
              className="card p-3 flex items-center justify-between gap-2 transition-colors hover:border-border-light"
            >
              <div className="min-w-0 flex items-center gap-2">
                <span className="font-medium text-sm text-slate-100 truncate">
                  {item.word}
                </span>
                <Badge variant={getSeverityBadgeVariant(item.severity)}>
                  {item.severity || "medium"}
                </Badge>
              </div>

              <button
                onClick={() => onRemove?.(item._id)}
                className="text-slate-400 hover:text-danger hover:bg-danger-light p-1 rounded transition-colors shrink-0"
                title="Remove blocked word"
                aria-label={`Remove ${item.word}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
