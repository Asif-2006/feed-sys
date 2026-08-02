import { useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Loader from "../Loader/Loader";

export default function BlockedWordTable({ words, isLoading, onAdd, onRemove, isAdding }) {
  const [newWord, setNewWord] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = newWord.trim();
    if (!trimmed) return;
    onAdd?.(trimmed);
    setNewWord("");
  };

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-5 flex flex-col gap-2 sm:flex-row">
        <Input
          name="newWord"
          placeholder="Add a word to block"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" isLoading={isAdding}>
          Add
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : !words?.length ? (
        <p className="py-12 text-center text-sm text-muted">No blocked words yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {words.map((item) => (
            <li
              key={item._id}
              className="flex items-center gap-2 rounded-full bg-base border border-border px-3.5 py-1.5 text-sm text-slate-200"
            >
              {item.word}
              <button
                onClick={() => onRemove?.(item._id)}
                className="text-muted hover:text-danger"
                aria-label={`Remove ${item.word}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
