import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Media Feed",
    description: "Publish photo posts with rich captions in seconds. Zero delays, maximum performance.",
  },
  {
    icon: "🛡️",
    title: "Automated Moderation",
    description: "Built-in AI vision & text filters keep content safe, respectful, and guideline-compliant.",
  },
  {
    icon: "🔒",
    title: "Secure & Cookie-Based",
    description: "Industry standard HttpOnly session security without client-side token exposure.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-12 sm:py-20 flex flex-col items-center">
      {/* Hero Badge */}
      <div className="mb-6">
        <Badge variant="primary" className="px-3.5 py-1 text-xs sm:text-sm">
          ✨ Next-Gen Moderated Feed Platform
        </Badge>
      </div>

      {/* Hero Title & Subtitle */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-center tracking-tight text-slate-100 max-w-3xl leading-[1.15]">
        Share moments on a{" "}
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          clean & safe
        </span>{" "}
        community feed.
      </h1>

      <p className="mt-5 text-base sm:text-lg text-muted text-center max-w-xl leading-relaxed">
        A lightweight, dark-themed social feed engineered with active automated image
        and text moderation to ensure safe conversations.
      </p>

      {/* Hero CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        {isAuthenticated ? (
          <Link to="/feed">
            <Button size="lg" variant="primary">
              Go to Feed →
            </Button>
          </Link>
        ) : (
          <>
            <Link to="/register">
              <Button size="lg" variant="primary">
                Get Started Free →
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Log in to Account
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Preview Card Mockup */}
      <div className="mt-16 w-full max-w-2xl">
        <div className="card p-5 border-border-light shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-xs text-white">
              FS
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">FeedSys Team</p>
              <p className="text-xs text-muted">Just now &bull; Verified</p>
            </div>
          </div>

          <p className="text-sm text-slate-200 mb-4 leading-relaxed">
            Welcome to FeedSys! Experience real-time media sharing protected by automated safety filters.
          </p>

          <div className="rounded-lg bg-surface-hover h-64 flex flex-col items-center justify-center border border-border text-center p-6">
            <span className="text-4xl mb-2">📸</span>
            <p className="text-sm font-medium text-slate-300">Clean, crisp photo feeds</p>
            <p className="text-xs text-muted mt-1">Automatic compression & guideline moderation</p>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map((feat) => (
          <div
            key={feat.title}
            className="card p-6 transition-colors duration-150 hover:border-border-light"
          >
            <div className="text-2xl mb-3">{feat.icon}</div>
            <h3 className="text-base font-semibold text-slate-100 mb-1.5">{feat.title}</h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
