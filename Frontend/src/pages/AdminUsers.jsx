import { useState } from "react";
import Input from "../components/Input/Input";
import Textarea from "../components/Textarea/Textarea";
import Button from "../components/Button/Button";
import { blockUser, unblockUser } from "../api/admin.api";
import { useToast } from "../hooks/useToast";

// TODO: The backend does not currently expose a GET /admin/users (or
// similar) endpoint to list users, so this page cannot render a searchable
// user table. Block/unblock only work against a user ID you already have.
// Once a list endpoint exists, replace this form with a real user table.
export default function AdminUsers() {
  const toast = useToast();
  const [blockForm, setBlockForm] = useState({ userId: "", reason: "" });
  const [unblockId, setUnblockId] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [isUnblocking, setIsUnblocking] = useState(false);

  const handleBlock = async (e) => {
    e.preventDefault();
    if (!blockForm.userId.trim()) return;
    setIsBlocking(true);
    try {
      await blockUser(blockForm.userId.trim(), blockForm.reason.trim());
      toast.success("User blocked");
      setBlockForm({ userId: "", reason: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't block this user.");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblock = async (e) => {
    e.preventDefault();
    if (!unblockId.trim()) return;
    setIsUnblocking(true);
    try {
      await unblockUser(unblockId.trim());
      toast.success("User unblocked");
      setUnblockId("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't unblock this user.");
    } finally {
      setIsUnblocking(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-slate-100">Manage Users</h1>
      <p className="mb-6 text-sm text-muted">
        No endpoint is available yet to list users, so users must be blocked or unblocked by ID.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <form onSubmit={handleBlock} className="card space-y-4 p-5">
          <h2 className="text-sm font-semibold text-slate-100">Block a user</h2>
          <Input
            label="User ID"
            name="userId"
            placeholder="507f1f77bcf86cd799439011"
            value={blockForm.userId}
            onChange={(e) => setBlockForm((prev) => ({ ...prev, userId: e.target.value }))}
          />
          <Textarea
            label="Reason"
            name="reason"
            placeholder="Reason for blocking"
            value={blockForm.reason}
            onChange={(e) => setBlockForm((prev) => ({ ...prev, reason: e.target.value }))}
            rows={3}
          />
          <Button type="submit" variant="danger" isLoading={isBlocking} className="w-full">
            Block user
          </Button>
        </form>

        <form onSubmit={handleUnblock} className="card space-y-4 p-5">
          <h2 className="text-sm font-semibold text-slate-100">Unblock a user</h2>
          <Input
            label="User ID"
            name="unblockUserId"
            placeholder="507f1f77bcf86cd799439011"
            value={unblockId}
            onChange={(e) => setUnblockId(e.target.value)}
          />
          <Button type="submit" variant="secondary" isLoading={isUnblocking} className="w-full">
            Unblock user
          </Button>
        </form>
      </div>
    </div>
  );
}
