// Deterministic stars spanning entire viewport width and height
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  top: `${((i * 17 + 5) % 96) + 2}%`,
  left: `${((i * 23 + 11) % 98) + 1}%`,
  size: (i % 4 === 0 ? 2.5 : i % 2 === 0 ? 1.8 : 1.2) + "px",
  delay: `${(i * 0.22).toFixed(2)}s`,
  opacity: (0.35 + (i % 5) * 0.15).toFixed(2),
}));

// Full-screen aesthetic meteor shower with sleek 70px - 125px tails
const METEORS = [
  { id: 1, top: "-4%", right: "8%", width: "110px", delay: "0s", duration: "3.2s", alt: false },
  { id: 2, top: "4%", right: "26%", width: "85px", delay: "-1.4s", duration: "3.8s", alt: true },
  { id: 3, top: "-2%", right: "48%", width: "125px", delay: "-0.7s", duration: "3.4s", alt: false },
  { id: 4, top: "-6%", right: "68%", width: "95px", delay: "-2.3s", duration: "4.0s", alt: true },
  { id: 5, top: "10%", right: "86%", width: "115px", delay: "-0.4s", duration: "3.5s", alt: false },
  { id: 6, top: "20%", right: "14%", width: "80px", delay: "-1.9s", duration: "3.9s", alt: true },
  { id: 7, top: "14%", right: "38%", width: "105px", delay: "-2.8s", duration: "3.3s", alt: false },
  { id: 8, top: "26%", right: "58%", width: "120px", delay: "-1.1s", duration: "3.6s", alt: true },
  { id: 9, top: "6%", right: "96%", width: "90px", delay: "-1.7s", duration: "3.2s", alt: false },
  { id: 10, top: "34%", right: "4%", width: "100px", delay: "-3.1s", duration: "4.1s", alt: false },
  { id: 11, top: "30%", right: "78%", width: "85px", delay: "-0.6s", duration: "3.7s", alt: true },
  { id: 12, top: "44%", right: "28%", width: "115px", delay: "-2.1s", duration: "3.4s", alt: false },
  { id: 13, top: "40%", right: "52%", width: "95px", delay: "-2.6s", duration: "3.9s", alt: true },
  { id: 14, top: "54%", right: "18%", width: "90px", delay: "-0.9s", duration: "3.5s", alt: false },
];

export default function CosmicBackground({ mouseX = 0, mouseY = 0 }) {
  const pFactor = `translate3d(${mouseX * 15}px, ${mouseY * 15}px, 0)`;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. Ambient Nebula Auroras */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-24 w-[850px] sm:w-[1200px] h-[550px] bg-gradient-to-tr from-primary/25 via-cyan-500/15 to-violet-600/20 blur-[150px] rounded-full" />
      <div className="absolute top-[35%] -left-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent blur-[150px] rounded-full" />
      <div className="absolute top-[60%] -right-40 w-[650px] h-[650px] bg-gradient-to-tl from-cyan-500/15 via-violet-600/15 to-transparent blur-[150px] rounded-full" />

      {/* 2. Twinkling Starfield */}
      <div className="absolute inset-0" style={{ transform: pFactor }}>
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle shadow-[0_0_6px_#38bdf8]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* 3. Full-Screen Aesthetic Shooting Meteors */}
      <div className="absolute inset-0">
        {METEORS.map((m) => (
          <span
            key={m.id}
            className={`meteor ${m.alt ? "meteor-alt" : ""}`}
            style={{
              top: m.top,
              right: m.right,
              width: m.width,
              animationDelay: m.delay,
              animationDuration: m.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}

