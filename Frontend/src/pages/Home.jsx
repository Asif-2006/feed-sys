import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMagneticButtons } from "../hooks/useMagneticButtons";
import "./Home.css";

// Matches Button.jsx's primary/secondary variants at size="lg" so these
// <Link> based CTAs look identical to the rest of the app's buttons.
const CTA_PRIMARY =
  "hx-btn inline-flex items-center justify-center gap-2 font-medium transition duration-150 active:scale-[0.98] text-base px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-hover";
const CTA_SECONDARY =
  "hx-btn inline-flex items-center justify-center gap-2 font-medium transition duration-150 active:scale-[0.98] text-base px-6 py-3 rounded-xl bg-surface text-slate-100 border border-border hover:border-slate-500";

const FEATURES = [
  {
    icon: "📸",
    title: "Share instantly",
    desc: "Post an image and a caption in seconds — no clutter, no distractions.",
  },
  {
    icon: "🛡️",
    title: "Moderated by design",
    desc: "Blocked-word filtering keeps conversations on your platform civil.",
  },
  {
    icon: "📱",
    title: "Built for every screen",
    desc: "A feed that looks just as sharp on your phone as it does on your desktop.",
  },
];

const CAPTIONS = [
  "Golden hour never disappoints ☀️",
  "New city, new perspective 🌆",
  "Coffee first, questions later ☕",
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  const rootRef = useRef(null);
  const fxLayerRef = useRef(null);
  const scrollBarRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const sceneInnerRef = useRef(null);
  const badgeRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const scrollCueRef = useRef(null);
  const previewStageRef = useRef(null);
  const previewCardRef = useRef(null);
  const typingRef = useRef(null);

  useMagneticButtons(rootRef, [isAuthenticated]);

  // This page makes no API calls — it's pure static/decorative content.
  // Everything below is presentational animation wiring only.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const fxLayer = fxLayerRef.current;

    // Capture pristine text up front so cleanup can restore it exactly.
    // Without this, React StrictMode's dev-only double-invoke of effects
    // would re-split already-split text and duplicate/corrupt it.
    const rawTextTargets = [subRef.current, ...root.querySelectorAll(".hx-feature h3, .hx-feature p")].filter(
      Boolean
    );
    const textBackups = new Map(rawTextTargets.map((el) => [el, el.textContent]));

    // ---------- Depth layers: static translateZ per element ----------
    root.querySelectorAll(".hx-depth-layer").forEach((el) => {
      const tz = getComputedStyle(el).getPropertyValue("--hx-tz").trim() || "0px";
      el.style.transform = `translateZ(${tz})`;
    });

    // ---------- 3D scene tilt driven by cursor (eased, desktop only) ----------
    const sceneInner = sceneInnerRef.current;
    let targetRX = 0,
      targetRY = 0,
      curRX = 0,
      curRY = 0;
    const onSceneMouseMove = (e) => {
      const relX = e.clientX / window.innerWidth - 0.5;
      const relY = e.clientY / window.innerHeight - 0.5;
      targetRY = relX * 10;
      targetRX = -relY * 7;
    };
    let tiltRaf;
    if (!isCoarsePointer) {
      window.addEventListener("mousemove", onSceneMouseMove);
      const tiltLoop = () => {
        curRX += (targetRX - curRX) * 0.055;
        curRY += (targetRY - curRY) * 0.055;
        if (sceneInner) sceneInner.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg)`;
        tiltRaf = requestAnimationFrame(tiltLoop);
      };
      tiltLoop();
    }

    // ---------- Scroll progress + scroll-cue fade ----------
    const scrollBar = scrollBarRef.current;
    const scrollCue = scrollCueRef.current;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      if (scrollBar) scrollBar.style.width = pct + "%";
      if (scrollCue) scrollCue.style.opacity = h.scrollTop > 40 ? "0" : "";
    };
    window.addEventListener("scroll", onScroll);

    // ---------- Custom cursor + comet trail (desktop only) ----------
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    let mx = -1000,
      my = -1000,
      rx = 0,
      ry = 0,
      trailCount = 0;
    const onCursorMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.left = mx + "px";
        dot.style.top = my + "px";
      }
      trailCount++;
      if (fxLayer && trailCount % 4 === 0) {
        const t = document.createElement("div");
        t.className = "hx-trail-dot";
        t.style.left = mx + "px";
        t.style.top = my + "px";
        fxLayer.appendChild(t);
        setTimeout(() => t.remove(), 600);
      }
    };
    let ringRaf;
    if (!isCoarsePointer) {
      window.addEventListener("mousemove", onCursorMove);
      const animateRing = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        if (ring) {
          ring.style.left = rx + "px";
          ring.style.top = ry + "px";
        }
        ringRaf = requestAnimationFrame(animateRing);
      };
      animateRing();
    }

    const hoverables = root.querySelectorAll("a, button, .hx-feature, [data-magnetic]");
    const hoverHandlers = [];
    if (!isCoarsePointer) {
      hoverables.forEach((el) => {
        const enter = () => ring?.classList.add("hovering");
        const leave = () => ring?.classList.remove("hovering");
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        hoverHandlers.push([el, enter, leave]);
      });
    }

    // ---------- Ambient floating particles (skip on touch: no payoff) ----------
    const particleEls = [];
    if (!isCoarsePointer && fxLayer) {
      const particleCount = window.innerWidth < 640 ? 7 : 14;
      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("div");
        p.className = "hx-particle";
        const size = 2 + Math.random() * 3;
        p.style.width = p.style.height = size + "px";
        p.style.left = Math.random() * 100 + "vw";
        p.style.setProperty("--hx-drift", Math.random() * 60 - 30 + "px");
        p.style.animationDuration = 10 + Math.random() * 10 + "s";
        p.style.animationDelay = Math.random() * 10 + "s";
        fxLayer.appendChild(p);
        particleEls.push(p);
      }
    }

    // ---------- Background blob parallax (desktop only) ----------
    const blobs = root.querySelectorAll("[data-blob]");
    const onBlobMove = (e) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      blobs.forEach((b, i) => {
        const strength = (i + 1) * 14;
        b.style.marginLeft = cx * strength + "px";
        b.style.marginTop = cy * strength + "px";
      });
    };
    if (!isCoarsePointer) window.addEventListener("mousemove", onBlobMove);

    // ---------- Magnetic buttons + tactile press + ripple + spark ----------
    // Handled by the shared useMagneticButtons hook (see below) so the
    // Navbar's Sign up/Log out buttons get identical behavior instead of
    // this page reimplementing it separately.

    // ---------- Badge coin-flip on hover (desktop only) ----------
    const badgeEl = badgeRef.current;
    const onBadgeEnter = () => {
      badgeEl?.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(360deg)" }], {
        duration: 600,
        easing: "ease",
      });
    };
    if (!isCoarsePointer) badgeEl?.addEventListener("mouseenter", onBadgeEnter);

    // ---------- Headline: words converge from left/right edges ----------
    const headline = headlineRef.current;
    const words = [
      ["Share", "word"],
      ["moments", "word"],
      ["that", "word"],
      ["matter,", "grad-word"],
      ["on", "word"],
      ["a", "word"],
      ["platform", "word"],
      ["built", "word"],
      ["for", "word"],
      ["real", "word"],
      ["conversation.", "grad-word"],
    ];
    if (headline) {
      headline.innerHTML = "";
      const midpoint = words.length / 2;
      words.forEach(([text, cls], i) => {
        const span = document.createElement("span");
        span.className = cls === "grad-word" ? "hx-word hx-grad-word" : "hx-word";
        span.textContent = text;
        span.classList.add(i < midpoint ? "hx-from-left" : i > midpoint ? "hx-from-right" : "hx-center");
        span.style.animationDelay = 140 + i * 55 + "ms";
        headline.appendChild(span);
      });
    }

    // ---------- Cursor-proximity letter distortion (desktop only) ----------
    let cursorX = -9999,
      cursorY = -9999;
    const onDistortMove = (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    };
    if (!isCoarsePointer) window.addEventListener("mousemove", onDistortMove);

    function makeTextDistortable(element) {
      if (!element) return;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
      const nodesToReplace = [];
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent.trim().length > 0) nodesToReplace.push(node);
      }
      nodesToReplace.forEach((textNode) => {
        const parentEl = textNode.parentElement;
        // .hx-grad-word relies on background-clip:text + color:transparent
        // on a single element. Splitting its text into child spans breaks
        // that (children inherit transparent color but have no gradient
        // background of their own), so keep it as one distortable unit.
        if (parentEl && parentEl.classList.contains("hx-grad-word")) {
          parentEl.classList.add("hx-distortable-char");
          return;
        }
        const frag = document.createDocumentFragment();
        const wordList = textNode.textContent.split(" ");
        wordList.forEach((word, wi) => {
          if (word.length > 0) {
            // Group each word's letters in a white-space:nowrap wrapper so
            // the browser can never break a line mid-word — only the real
            // space text nodes between wrappers (below) are valid breaks.
            const wordSpan = document.createElement("span");
            wordSpan.className = "hx-distortable-word";
            for (const char of word) {
              const charSpan = document.createElement("span");
              charSpan.textContent = char;
              charSpan.className = "hx-distortable-char";
              wordSpan.appendChild(charSpan);
            }
            frag.appendChild(wordSpan);
          }
          if (wi < wordList.length - 1) frag.appendChild(document.createTextNode(" "));
        });
        textNode.parentNode.replaceChild(frag, textNode);
      });
    }

    if (!isCoarsePointer) {
      makeTextDistortable(headline);
      makeTextDistortable(subRef.current);
      root.querySelectorAll(".hx-feature h3, .hx-feature p").forEach((el) => makeTextDistortable(el));
    }

    let distortRaf;
    function distortAllText() {
      const chars = root.querySelectorAll(".hx-distortable-char");
      const radius = 180;
      chars.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;
        const dx = cursorX - charX;
        const dy = cursorY - charY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / radius);
        const angle = Math.atan2(dy, dx);
        const distortX = Math.cos(angle) * influence * 14;
        const distortY = Math.sin(angle) * influence * 10;
        const skewAmount = influence * 0.18;
        span.style.transform = `translate(${distortX}px, ${distortY}px) skewX(${skewAmount}rad)`;
        span.style.opacity = 1 - influence * 0.12;
      });
      distortRaf = requestAnimationFrame(distortAllText);
    }
    if (!isCoarsePointer) distortAllText();

    // ---------- Preview card tilt (desktop only) ----------
    const card = previewCardRef.current;
    const stage = previewStageRef.current;
    const onStageMove = (e) => {
      if (!stage || !card) return;
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateZ(20px)`;
    };
    const onStageLeave = () => {
      if (card) card.style.transform = "rotateY(0) rotateX(0) translateZ(0)";
    };
    if (!isCoarsePointer) {
      stage?.addEventListener("mousemove", onStageMove);
      stage?.addEventListener("mouseleave", onStageLeave);
    }

    // ---------- Feature card 3D tilt + glare (desktop only) ----------
    const featureEls = root.querySelectorAll(".hx-feature");
    const featureCleanups = [];
    if (!isCoarsePointer) {
      featureEls.forEach((f) => {
        const onMove = (e) => {
          if (!f.classList.contains("hx-visible")) return;
          const r = f.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          f.style.setProperty("--hx-mx", px * 100 + "%");
          f.style.setProperty("--hx-my", py * 100 + "%");
          f.style.transform = `translateY(-6px) translateZ(20px) rotateY(${(px - 0.5) * 12}deg) rotateX(${
            -(py - 0.5) * 12
          }deg)`;
        };
        const onLeave = () => {
          if (f.classList.contains("hx-visible")) {
            f.style.transform = "translateY(0) translateZ(0) rotateY(0) rotateX(0)";
          }
        };
        f.addEventListener("mousemove", onMove);
        f.addEventListener("mouseleave", onLeave);
        featureCleanups.push(() => {
          f.removeEventListener("mousemove", onMove);
          f.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    // ---------- Typing effect inside preview card ----------
    const typeEl = typingRef.current;
    let ci = 0,
      chi = 0,
      deleting = false;
    let typeTimeout;
    function typeLoop() {
      const full = CAPTIONS[ci];
      if (!deleting) {
        chi++;
        if (chi > full.length) {
          deleting = true;
          typeTimeout = setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        chi--;
        if (chi < 0) {
          deleting = false;
          ci = (ci + 1) % CAPTIONS.length;
          chi = 0;
        }
      }
      if (typeEl) typeEl.innerHTML = full.slice(0, chi) + '<span class="hx-caret"></span>';
      typeTimeout = setTimeout(typeLoop, deleting ? 28 : 42);
    }
    typeTimeout = setTimeout(typeLoop, 1900);

    // ---------- Scroll-reveal feature cards ----------
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("hx-visible"), i * 130);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    featureEls.forEach((el) => io.observe(el));

    // ---------- Cleanup ----------
    return () => {
      window.removeEventListener("mousemove", onSceneMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onCursorMove);
      window.removeEventListener("mousemove", onBlobMove);
      window.removeEventListener("mousemove", onDistortMove);

      cancelAnimationFrame(tiltRaf);
      cancelAnimationFrame(ringRaf);
      if (distortRaf) cancelAnimationFrame(distortRaf);
      clearTimeout(typeTimeout);

      hoverHandlers.forEach(([el, enter, leave]) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      featureCleanups.forEach((fn) => fn());

      stage?.removeEventListener("mousemove", onStageMove);
      stage?.removeEventListener("mouseleave", onStageLeave);
      badgeEl?.removeEventListener("mouseenter", onBadgeEnter);

      io.disconnect();

      particleEls.forEach((p) => p.remove());
      if (fxLayer) fxLayer.innerHTML = "";

      if (headline) headline.innerHTML = "";
      textBackups.forEach((text, el) => {
        el.textContent = text;
      });

      if (card) card.style.transform = "";
      if (sceneInner) sceneInner.style.transform = "";
    };
  }, [isAuthenticated]);

  return (
    <div className="home-page" ref={rootRef}>
      <div className="hx-scroll-bar" ref={scrollBarRef} />
      <div className="hx-cursor-dot" ref={cursorDotRef} />
      <div className="hx-cursor-ring" ref={cursorRingRef} />

      <div className="hx-bg-layer">
        <div className="hx-blob hx-blob-1" data-blob />
        <div className="hx-blob hx-blob-2" data-blob />
        <div className="hx-blob hx-blob-3" data-blob />
      </div>
      <div className="hx-grain" />

      {/* Static container for particles/trail-dots — React never touches
          its children again after mount, so imperative JS can safely
          append/remove nodes here without fighting React's reconciler. */}
      <div ref={fxLayerRef} />

      <div className="hx-main">
        <div className="hx-scene">
          <div className="hx-scene-inner" ref={sceneInnerRef}>
            <div className="hx-hero">
              <div className="hx-depth-layer" style={{ "--hx-tz": "6px" }}>
                <span className="hx-badge" ref={badgeRef}>
                  <span className="hx-badge-dot" /> Now in public beta
                </span>
              </div>

              <div className="hx-depth-layer" style={{ "--hx-tz": "44px" }}>
                <h1 ref={headlineRef} />
              </div>

              <div className="hx-depth-layer" style={{ "--hx-tz": "22px" }}>
                <p>
                  <span className="hx-distortable-text" ref={subRef}>
                    HexiNova pairs a clean, focused feed with word-level moderation, so your
                    community stays exactly that — a community.
                  </span>
                </p>
              </div>

              <div className="hx-depth-layer" style={{ "--hx-tz": "30px" }}>
                <div className="hx-cta-row">
                  {isAuthenticated ? (
                    <Link to="/feed" className={CTA_PRIMARY} data-magnetic>
                      Go to feed <span className="hx-btn-arrow">→</span>
                    </Link>
                  ) : (
                    <>
                      <Link to="/register" className={CTA_PRIMARY} data-magnetic>
                        Get started <span className="hx-btn-arrow">→</span>
                      </Link>
                      <Link to="/login" className={CTA_SECONDARY} data-magnetic>
                        Log in
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="hx-depth-layer" style={{ "--hx-tz": "12px" }}>
                <div className="hx-scroll-cue" ref={scrollCueRef}>
                  Scroll
                  <span className="hx-scroll-cue-arrow" />
                </div>
              </div>

              <div className="hx-depth-layer" style={{ "--hx-tz": "80px" }}>
                <div className="hx-preview-wrap">
                  <div className="hx-preview-stage" ref={previewStageRef}>
                    <div className="hx-ghost-card hx-ghost-1" />
                    <div className="hx-ghost-card hx-ghost-2" />
                    <div className="hx-preview-card" ref={previewCardRef}>
                      <div className="hx-preview-head">
                        <div className="hx-preview-avatar" />
                        <div className="hx-preview-lines">
                          <div className="hx-preview-line" />
                          <div className="hx-preview-line hx-short" />
                        </div>
                      </div>
                      <div className="hx-preview-image" />
                      <div className="hx-preview-caption" ref={typingRef}>
                        <span className="hx-caret" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hx-depth-layer" style={{ "--hx-tz": "16px" }}>
                <div className="hx-features">
                  {FEATURES.map((f) => (
                    <div className="hx-feature" key={f.title}>
                      <span className="hx-feature-icon">{f.icon}</span>
                      <h3>{f.title}</h3>
                      <p>{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
