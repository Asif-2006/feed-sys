import { useState } from "react";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";
import Button from "../components/common/Button";
import { blockUser, unblockUser } from "../api/admin.api";
import { useToast } from "../hooks/useToast";

export default function AdminUsers() {
  const toast = useToast();
  const [blockForm, setBlockForm] = useState({ userId: "", reason: "" });
  const [unblockId, setUnblockId] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [isUnblocking, setIsUnblocking] = useState(false);

  const handleBlock = async (e) => {
    e.preventDefault();
    const userId = blockForm.userId.trim();
    if (!userId) {
      toast.error("User ID is required.");
      return;
    }
    setIsBlocking(true);
    try {
      const { data } = await blockUser(userId, blockForm.reason.trim());
      toast.success(data?.message || "User blocked successfully.");
      setBlockForm({ userId: "", reason: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to block user.");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblock = async (e) => {
    e.preventDefault();
    const userId = unblockId.trim();
    if (!userId) {
      toast.error("User ID is required.");
      return;
    }
    setIsUnblocking(true);
    try {
      const { data } = await unblockUser(userId);
      toast.success(data?.message || "User unblocked successfully.");
      setUnblockId("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to unblock user.");
    } finally {
      setIsUnblocking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Block User Card */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🚫</span>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Block User Account</h2>
              <p className="text-xs text-muted">Revoke user access and send suspension email</p>
            </div>
          </div>

          <form onSubmit={handleBlock} className="space-y-4">
            <Input
              label="User MongoDB ID"
              name="userId"
              placeholder="e.g. 64b8f... (24 character hex)"
              value={blockForm.userId}
              onChange={(e) =>
                setBlockForm((prev) => ({ ...prev, userId: e.target.value }))
              }
            />

            <Textarea
              label="Reason for Suspension"
              name="reason"
              placeholder="Provide a reason for blocking this account..."
              value={blockForm.reason}
              onChange={(e) =>
                setBlockForm((prev) => ({ ...prev, reason: e.target.value }))
              }
              rows={3}
            />

            <Button
              type="submit"
              variant="danger"
              className="w-full"
              isLoading={isBlocking}
            >
              Block User
            </Button>
          </form>
        </div>

        {/* Unblock User Card */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">✅</span>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Unblock User Account</h2>
              <p className="text-xs text-muted">Restore active status to a suspended user</p>
            </div>
          </div>

          <form onSubmit={handleUnblock} className="space-y-4">
            <Input
              label="User MongoDB ID"
              name="unblockId"
              placeholder="e.g. 64b8f... (24 character hex)"
              value={unblockId}
              onChange={(e) => setUnblockId(e.target.value)}
            />

            <div className="pt-14 sm:pt-16">
              <Button
                type="submit"
                variant="secondary"
                className="w-full"
                isLoading={isUnblocking}
              >
                Unblock User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
