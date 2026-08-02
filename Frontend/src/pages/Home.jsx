import { Link } from "react-router-dom";
import Button from "../components/Button/Button";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  {
    title: "Share instantly",
    desc: "Post an image and a caption in seconds — no clutter, no distractions.",
    icon: "📸",
  },
  {
    title: "Moderated by design",
    desc: "Blocked-word filtering keeps conversations on your platform civil.",
    icon: "🛡️",
  },
  {
    title: "Built for every screen",
    desc: "A feed that looks just as sharp on your phone as it does on your desktop.",
    icon: "📱",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-accent/25 blur-3xl animate-blob [animation-delay:3s]" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob [animation-delay:6s]" />
      </div>

      <div className="flex flex-col items-center py-16 text-center sm:py-24">
        <span
          className="animate-fade-in-up rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold text-accent"
          style={{ animationDelay: "0ms" }}
        >
          Now in public beta
        </span>

        <h1
          className="animate-fade-in-up mt-6 max-w-2xl text-4xl font-bold leading-tight text-slate-100 sm:text-5xl"
          style={{ animationDelay: "100ms" }}
        >
          Share moments that matter, on a platform built for real conversation.
        </h1>

        <p
          className="animate-fade-in-up mt-4 max-w-xl text-muted sm:text-lg"
          style={{ animationDelay: "220ms" }}
        >
          HexiNova pairs a clean, focused feed with word-level moderation, so your community
          stays exactly that — a community.
        </p>

        <div
          className="animate-fade-in-up mt-8 flex gap-3"
          style={{ animationDelay: "340ms" }}
        >
          {isAuthenticated ? (
            <Link to="/feed">
              <Button size="lg">Go to feed</Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg">Get started</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  Log in
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Floating preview card, purely decorative */}
        <div
          className="animate-fade-in-up mt-16 w-full max-w-sm"
          style={{ animationDelay: "460ms" }}
        >
          <div className="card animate-float p-5 text-left">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
              <div>
                <div className="h-3 w-24 rounded bg-slate-600/50" />
                <div className="mt-1.5 h-2.5 w-16 rounded bg-slate-700/50" />
              </div>
            </div>
            <div className="mt-4 h-40 w-full rounded-xl bg-gradient-to-br from-primary/20 to-accent/20" />
            <div className="mt-4 h-2.5 w-3/4 rounded bg-slate-700/50" />
          </div>
        </div>

        <div className="mt-20 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="animate-fade-in-up card p-6 text-left"
              style={{ animationDelay: `${560 + i * 120}ms` }}
            >
              <span className="text-2xl">{feature.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-slate-100">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
