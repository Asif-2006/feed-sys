import { useEffect } from "react";

// Applies a magnetic cursor-follow, a tactile press-down, a click ripple,
// and a small spark burst to every element with [data-magnetic] inside the
// given container. Desktop only — on touch devices there's no hover to
// follow, so the whole thing is skipped and buttons behave like plain
// buttons (still get the ripple/spark on tap, just no cursor-follow).
//
// `deps` should include anything that changes which [data-magnetic]
// elements exist in the container (e.g. auth state swapping "Sign up" for
// "Log out"), so the listeners get rebound to the current DOM nodes.
export function useMagneticButtons(containerRef, deps = []) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const cleanups = [];

    container.querySelectorAll("[data-magnetic]").forEach((btn) => {
      let tx = 0,
        ty = 0,
        pressed = false;
      const apply = () => {
        btn.style.transform = `translate(${tx}px, ${ty}px) scale(${pressed ? 0.94 : 1})`;
      };
      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        tx = (e.clientX - r.left - r.width / 2) * 0.25;
        ty = (e.clientY - r.top - r.height / 2) * 0.35;
        apply();
      };
      const onLeave = () => {
        tx = 0;
        ty = 0;
        pressed = false;
        apply();
      };
      const onDown = () => {
        pressed = true;
        apply();
      };
      const onUp = () => {
        pressed = false;
        apply();
      };
      const onClick = (e) => {
        const r = btn.getBoundingClientRect();
        const clientX = e.clientX || r.left + r.width / 2;
        const clientY = e.clientY || r.top + r.height / 2;

        const ripple = document.createElement("span");
        ripple.className = "hx-ripple";
        const size = Math.max(r.width, r.height);
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = clientX - r.left - size / 2 + "px";
        ripple.style.top = clientY - r.top - size / 2 + "px";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        const colors = ["#3B82F6", "#06B6D4", "#F1F5F9"];
        for (let i = 0; i < 8; i++) {
          const s = document.createElement("div");
          s.className = "hx-spark";
          const angle = (Math.PI * 2 * i) / 8;
          const dist = 26 + Math.random() * 18;
          s.style.background = colors[i % colors.length];
          s.style.left = clientX + "px";
          s.style.top = clientY + "px";
          s.style.setProperty("--hx-sx", Math.cos(angle) * dist + "px");
          s.style.setProperty("--hx-sy", Math.sin(angle) * dist + "px");
          document.body.appendChild(s);
          setTimeout(() => s.remove(), 560);
        }
      };

      if (!isCoarsePointer) {
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        btn.addEventListener("mousedown", onDown);
        btn.addEventListener("mouseup", onUp);
      }
      btn.addEventListener("click", onClick);

      // The ripple needs a positioned, clipped ancestor. Force it inline
      // rather than requiring every caller to remember a CSS class.
      const prevPosition = btn.style.position;
      const prevOverflow = btn.style.overflow;
      if (!getComputedStyle(btn).position || getComputedStyle(btn).position === "static") {
        btn.style.position = "relative";
      }
      btn.style.overflow = "hidden";

      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
        btn.removeEventListener("mousedown", onDown);
        btn.removeEventListener("mouseup", onUp);
        btn.removeEventListener("click", onClick);
        btn.style.transform = "";
        btn.style.position = prevPosition;
        btn.style.overflow = prevOverflow;
      });
    });

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
