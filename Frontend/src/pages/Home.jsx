import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

const BENTO_FEATURES = [
  {
    tag: "AI Guardrail",
    title: "Dual-Engine AI Moderation",
    desc: "Every image and caption is scanned in parallel using SightEngine Vision & Groq LLaMA 3.3 70B before hitting the feed.",
    icon: "🛡️",
    badge: "Active Protection",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    gradient: "from-blue-600/20 via-cyan-500/10 to-transparent",
    colSpan: "md:col-span-2",
  },
  {
    tag: "Client Studio",
    title: "In-Browser Image Editor",
    desc: "Crop (1:1, 4:5, 16:9), rotate, zoom, drag-to-pan, and color adjust on HTML5 canvas before publishing.",
    icon: "🎨",
    badge: "Zero Plugins",
    badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    gradient: "from-cyan-600/20 via-blue-500/10 to-transparent",
    colSpan: "md:col-span-1",
  },
  {
    tag: "Optimistic UX",
    title: "Background Upload Tasks",
    desc: "Publish posts instantly without being trapped in modal spinners. Roam freely while simulated progress uploads in background.",
    icon: "⚡",
    badge: "Non-blocking",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    gradient: "from-amber-600/20 via-orange-500/10 to-transparent",
    colSpan: "md:col-span-1",
  },
  {
    tag: "High Performance",
    title: "Sharp 1080p WebP Compression",
    desc: "C-based native Sharp library automatically scales images to 1080px and compresses to WebP for 80% bandwidth savings.",
    icon: "🚀",
    badge: "Instant Delivery",
    badgeColor: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    gradient: "from-violet-600/20 via-purple-500/10 to-transparent",
    colSpan: "md:col-span-2",
  },
];

const STATS = [
  { value: "< 50ms", label: "Feed Load Latency" },
  { value: "1080px", label: "Optimized WebP" },
  { value: "100%", label: "Automated Safety" },
  { value: "HttpOnly", label: "Zero-Leak Auth" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [demoLiked, setDemoLiked] = useState(false);
  const [demoLikeCount, setDemoLikeCount] = useState(42);
  const [demoHeartPop, setDemoHeartPop] = useState(false);

  const toggleDemoLike = () => {
    setDemoLiked((prev) => {
      const next = !prev;
      setDemoLikeCount((c) => (next ? c + 1 : c - 1));
      if (next) {
        setDemoHeartPop(true);
        setTimeout(() => setDemoHeartPop(false), 600);
      }
      return next;
    });
  };

  return (
    <div className="relative py-8 sm:py-16 flex flex-col items-center overflow-hidden">
      {/* Ambient Neon Aurora Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-24 w-[650px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-primary/30 via-accent/25 to-violet-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-[-20%] w-[500px] h-[350px] bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, black 70%, transparent 100%)",
        }}
      />

      {/* Hero Badge with Glowing Beacon */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-surface/80 px-4 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:border-primary transition-colors">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent font-bold">
          FeedSys 2.0
        </span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-300">Next-Gen Moderated Social Feed</span>
      </div>

      {/* Hero Main Heading */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center tracking-tight text-slate-100 max-w-4xl leading-[1.1] sm:leading-[1.08]">
        The Future of{" "}
        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
          Safe & Lightning-Fast
        </span>{" "}
        Social Media.
      </h1>

      {/* Hero Subtitle */}
      <p className="mt-6 text-base sm:text-xl text-slate-300 text-center max-w-2xl leading-relaxed font-normal">
        Experience a dark-themed, ultra-responsive social timeline with automated AI image
        and text safety, in-panel photo editing, and zero-delay background publishing.
      </p>

      {/* Hero CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {isAuthenticated ? (
          <Link to="/feed">
            <Button
              size="lg"
              variant="primary"
              className="text-base px-7 py-3.5 shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_35px_rgba(59,130,246,0.7)] font-bold"
            >
              Open Your Feed ⚡
            </Button>
          </Link>
        ) : (
          <>
            <Link to="/register">
              <Button
                size="lg"
                variant="primary"
                className="text-base px-7 py-3.5 shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_35px_rgba(59,130,246,0.7)] font-bold group"
              >
                <span>Get Started Free</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-6 py-3.5 border-border-light hover:border-slate-400 font-semibold"
              >
                Sign In to Feed
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Live Interactive Post Mockup Stage */}
      <div className="mt-16 w-full max-w-2xl relative">
        {/* Glow ambient halo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-violet-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />

        {/* Floating Badges */}
        <div className="absolute -top-4 -left-3 sm:-left-6 z-20 hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/40 bg-surface/90 px-3 py-1.5 text-xs font-semibold text-emerald-300 shadow-xl backdrop-blur-md animate-bounce">
          <span>🛡️</span> AI Vision Verified Safe
        </div>

        <div className="absolute -bottom-4 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-2 rounded-full border border-cyan-500/40 bg-surface/90 px-3 py-1.5 text-xs font-semibold text-cyan-300 shadow-xl backdrop-blur-md">
          <span>⚡</span> WebP 80% Compressed
        </div>

        {/* Mockup Card */}
        <div className="relative card p-5 border-border-light bg-surface/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-sm text-white shadow-md shadow-primary/30">
                FS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-slate-100">FeedSys Official</p>
                  <span className="text-primary text-xs" title="Verified Badge">✓</span>
                </div>
                <p className="text-xs text-muted">San Francisco, CA &bull; Just now</p>
              </div>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light text-primary font-semibold border border-primary/30">
              Live Interactive Demo
            </span>
          </div>

          {/* Interactive Mockup Image with Double Click Heart */}
          <div
            className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center border border-border/60 cursor-pointer select-none group"
            onDoubleClick={toggleDemoLike}
          >
            {/* Visual gradient graphic mockup */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.25),transparent_70%)]" />

            <div className="text-center p-6 z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-4xl shadow-2xl shadow-cyan-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                📸
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-100">
                Crystal Clear Social Timeline
              </h3>
              <p className="text-xs text-muted mt-1.5 max-w-sm">
                Double click anywhere on this image to like, or tap the heart below!
              </p>
            </div>

            {/* Floating Heart Effect */}
            {demoHeartPop && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-scale-in z-30">
                <span className="text-7xl text-danger drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] filter">
                  ❤️
                </span>
              </div>
            )}
          </div>

          {/* Card Footer Interaction */}
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-border/60">
            <button
              onClick={toggleDemoLike}
              className={`flex items-center gap-2 text-sm font-semibold transition-transform duration-150 active:scale-90 ${
                demoLiked ? "text-danger" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <svg
                className={`w-6 h-6 transition-colors ${
                  demoLiked ? "fill-danger stroke-danger" : "fill-none stroke-current"
                }`}
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{demoLikeCount} likes</span>
            </button>

            <span className="text-xs text-slate-400">
              Captions moderated by <strong className="text-slate-200 font-semibold">LLaMA 3.3 70B</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics & Stats Ribbon */}
      <div className="mt-20 w-full grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="card p-5 text-center bg-surface/70 border-border hover:border-primary/40 transition-colors"
          >
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent font-mono">
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bento Grid Feature Showcase */}
      <div className="mt-24 w-full max-w-4xl">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Engineered for Excellence
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 mt-2">
            Packed with Next-Level Capabilities
          </h2>
          <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
            From automated visual safety to canvas image transforms, everything is optimized for speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BENTO_FEATURES.map((item) => (
            <div
              key={item.title}
              className={`card p-6 bg-gradient-to-br ${item.gradient} bg-surface/80 border-border hover:border-border-light transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between ${item.colSpan}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <span className="text-[11px] font-mono uppercase tracking-wider text-primary/90 font-bold block mb-1">
                  {item.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span>Production Ready</span>
                <span>•</span>
                <span className="text-slate-400 font-normal">Active System</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grand Bottom Glowing CTA Box */}
      <div className="mt-24 w-full max-w-4xl relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-cyan-400 to-violet-600 rounded-2xl blur-lg opacity-40" />

        <div className="relative card p-8 sm:p-12 text-center bg-surface/95 backdrop-blur-2xl border-border-light overflow-hidden">
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-accent/20 blur-3xl rounded-full pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Ready to experience the new standard?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join FeedSys today and start sharing moments with automated moderation and zero lag.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link to={isAuthenticated ? "/feed" : "/register"}>
              <Button
                size="lg"
                variant="primary"
                className="text-base px-8 py-3.5 font-bold shadow-[0_0_30px_rgba(59,130,246,0.6)]"
              >
                {isAuthenticated ? "Launch Feed →" : "Create Account Now →"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
