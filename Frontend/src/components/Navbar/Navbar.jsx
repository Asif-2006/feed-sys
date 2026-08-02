import { Link, useNavigate } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { getAuthorDisplayName } from "../../utils/helpers";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out");
      navigate("/login");
    } catch {
      toast.error("Couldn't sign out. Please try again.");
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
            H
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-100">HexiNova</span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/feed" className="text-sm font-medium text-slate-300 hover:text-white">
                Feed
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/blocked-words"
                  className="hidden text-sm font-medium text-slate-300 hover:text-white sm:block"
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2">
                <Avatar
                  profilePicture={user?.profilePicture}
                  name={getAuthorDisplayName(user)}
                  size="sm"
                />
                <span className="hidden text-sm text-slate-300 sm:block">
                  {getAuthorDisplayName(user)}
                </span>
              </div>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">
                Log in
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
