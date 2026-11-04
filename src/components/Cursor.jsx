import { useEffect, useRef } from "react";
import gsap from "gsap";

// Luxury cursor: a dot that follows exactly + a lagging ring that grows over interactive targets.
export default function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: .08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: .08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: .5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: .5, ease: "power3" });
    const move = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e) => {
      const t = e.target.closest?.("a, button, select, input, [data-cursor]");
      const r = ring.current; if (!r) return;
      const mode = t?.getAttribute?.("data-cursor");
      r.classList.toggle("is-hover", !!t && mode !== "view");
      r.classList.toggle("is-view", mode === "view");
      r.textContent = mode === "view" ? "VIEW" : "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", over); document.body.classList.remove("has-cursor"); };
  }, []);
  return <><div ref={ring} className="cursor-ring" aria-hidden /><div ref={dot} className="cursor-dot" aria-hidden /></>;
}
