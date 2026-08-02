import { useEffect, useState } from "react";
import BlockedWordTable from "../components/BlockedWordTable/BlockedWordTable";
import { addBlockedWord, deleteBlockedWord, getBlockedWords } from "../api/admin.api";
import { useToast } from "../hooks/useToast";

export default function AdminBlockedWords() {
  const toast = useToast();
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    getBlockedWords()
      .then(({ data }) => setWords(data?.words ?? data ?? []))
      .catch(() => toast.error("Couldn't load blocked words."))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (word) => {
    setIsAdding(true);
    try {
      const { data } = await addBlockedWord(word);
      const created = data?.word ?? data ?? { _id: crypto.randomUUID(), word };
      setWords((prev) => [...prev, created]);
      toast.success(`Added "${word}" to blocked words`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't add this word.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (wordId) => {
    const prevWords = words;
    setWords((prev) => prev.filter((w) => w._id !== wordId));
    try {
      await deleteBlockedWord(wordId);
    } catch {
      toast.error("Couldn't remove this word.");
      setWords(prevWords);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-slate-100">Blocked Words</h1>
      <p className="mb-6 text-sm text-muted">
        Manage the list of words filtered by the moderation service.
      </p>

      <div className="card p-6">
        <BlockedWordTable
          words={words}
          isLoading={isLoading}
          isAdding={isAdding}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}
