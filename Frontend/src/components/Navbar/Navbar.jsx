import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useMagneticButtons } from "../../hooks/useMagneticButtons";
import { getAuthorDisplayName, classNames } from "../../utils/helpers";

// Centered-underline-grow-on-hover, done purely with Tailwind arbitrary
// values so no extra CSS file is needed for the navbar.
const navLinkClasses =
  "relative pb-1 text-sm font-medium text-slate-300 transition-colors duration-150 hover:text-white " +
  "after:absolute after:left-1/2 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-accent " +
  "after:transition-all after:duration-200 hover:after:left-0 hover:after:w-full";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const badgeRef = useRef(null);
  const navRef = useRef(null);

  // Same magnetic/ripple/spark/press interaction the hero CTAs use, so
  // "Sign up" and "Log out" here feel identical rather than plain buttons.
  // isAdmin/isAuthenticated are included so the hook rebinds whenever the
  // set of [data-magnetic] buttons in the nav actually changes.
  useMagneticButtons(navRef, [isAuthenticated, isAdmin]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out");
      navigate("/login");
    } catch {
      toast.error("Couldn't sign out. Please try again.");
    }
  };

  // Quick coin-flip spin on the logo badge, independent of any CSS
  // animation already running on it (Web Animations API composites
  // cleanly alongside the pulsing ring below).
  const spinLogo = () => {
    badgeRef.current?.animate(
      [{ transform: "rotateY(0deg)" }, { transform: "rotateY(360deg)" }],
      { duration: 600, easing: "ease" }
    );
  };

  return (
    <nav
      ref={navRef}
      className={classNames(
        "sticky top-0 z-40 border-b border-border backdrop-blur-xl transition-shadow duration-300",
        scrolled ? "bg-surface/90 shadow-lg shadow-black/30" : "bg-surface/60"
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="animate-slide-in-left flex shrink-0 items-center gap-2"
          onMouseEnter={spinLogo}
        >
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-lg bg-primary opacity-40" />
            <span
              ref={badgeRef}
              style={{ transformStyle: "preserve-3d" }}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white"
            >
              H
            </span>
          </span>
          {/* Wordmark hidden on small screens to leave room for Feed/Admin/
              Logout, which matter more than the text logo once space is tight. */}
          <span className="hidden text-lg font-semibold tracking-tight text-slate-100 sm:inline">
            HexiNova
          </span>
        </Link>

        <div className="animate-slide-in-right ml-auto flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/feed" className={navLinkClasses}>
                Feed
              </Link>
              {/* Always visible, not just on larger screens — admins need
                  to reach these pages from a phone too. */}
              {isAdmin && (
                <Link to="/admin/blocked-words" className={navLinkClasses}>
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
              <Button size="sm" variant="ghost" onClick={handleLogout} data-magnetic>
                Log out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className={navLinkClasses}>
                Log in
              </Link>
              <Link to="/register">
                <Button size="sm" data-magnetic>
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
