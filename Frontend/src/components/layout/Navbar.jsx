import { Link, NavLink, useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { getAuthorDisplayName, classNames } from "../../utils/helpers";

const navLinkClasses = ({ isActive }) =>
  classNames(
    "text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-150",
    isActive
      ? "bg-primary-light text-primary font-semibold"
      : "text-slate-300 hover:text-white hover:bg-surface-hover"
  );

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/login");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-white font-bold text-base shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform duration-150">
            F
          </span>
          <span className="text-base font-bold tracking-tight text-slate-100">
            FeedSys
          </span>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <NavLink to="/feed" className={navLinkClasses}>
                Feed
              </NavLink>

              {isAdmin && (
                <NavLink to="/admin/users" className={navLinkClasses}>
                  Admin
                </NavLink>
              )}

              <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

              {/* User Profile Info */}
              <div className="flex items-center gap-2.5 pl-1">
                <Avatar
                  profilePicture={user?.profilePicture}
                  name={getAuthorDisplayName(user)}
                  size="sm"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-semibold text-slate-100 leading-tight">
                    {getAuthorDisplayName(user)}
                  </span>
                  {isAdmin && (
                    <Badge variant="primary" className="text-[10px] px-1.5 py-0 mt-0.5 self-start">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-danger hover:bg-danger-light"
              >
                Log out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
