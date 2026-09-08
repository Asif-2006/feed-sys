import { useEffect, useState } from "react";
import BlockedWordTable from "../components/admin/BlockedWordTable";
import { addBlockedWord, deleteBlockedWord, getBlockedWords } from "../api/admin.api";
import { useToast } from "../hooks/useToast";

export default function AdminBlockedWords() {
  const toast = useToast();
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchBlockedWords();
  }, []);

  const fetchBlockedWords = async () => {
    setIsLoading(true);
    try {
      const { data } = await getBlockedWords();
      setWords(Array.isArray(data) ? data : data?.words || []);
    } catch {
      toast.error("Failed to load blocked words list.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWord = async ({ word, category, severity }) => {
    setIsAdding(true);
    try {
      const { data } = await addBlockedWord({ word, category, severity });
      const created = data?.blockedWord || data?.word || data;
      setWords((prev) => [...prev, created]);
      toast.success(`Word "${word}" added to moderation filter`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not add blocked word.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveWord = async (wordId) => {
    const previous = words;
    setWords((prev) => prev.filter((w) => w._id !== wordId));
    try {
      await deleteBlockedWord(wordId);
      toast.success("Blocked word removed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove word.");
      setWords(previous);
    }
  };

  return (
    <div className="space-y-4">
      <BlockedWordTable
        words={words}
        isLoading={isLoading}
        isAdding={isAdding}
        onAdd={handleAddWord}
        onRemove={handleRemoveWord}
      />
    </div>
  );
}
