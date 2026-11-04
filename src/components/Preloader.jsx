import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLenis } from "../lib/scroll";

// Intro: monogram draws in, counter climbs, curtain lifts. Shown once per session.
export default function Preloader({ onDone }) {
  const root = useRef(null), num = useRef(null);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const lenis = getLenis(); lenis?.stop();
    const obj = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { setGone(true); lenis?.start(); onDone?.(); } });
    tl.fromTo(".pl-letter", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .07, duration: .9, ease: "power4.out" })
      .fromTo(".pl-line", { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, "<.2")
      .to(obj, { v: 100, duration: 1.4, ease: "power2.inOut", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(obj.v)).padStart(3, "0"); } }, "<")
      .to(".pl-content", { opacity: 0, y: -20, duration: .5, ease: "power2.in" }, "+=.15")
      .to(root.current, { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, "-=.1");
    return () => { tl.kill(); lenis?.start(); };
  }, []);
  if (gone) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0c0b09]">
      <div className="pl-content text-center">
        <div className="serif flex justify-center overflow-hidden text-5xl tracking-[.28em] text-[#efe9dd] md:text-7xl">
          {"ÉLVARÉ".split("").map((c, i) => <span key={i} className="pl-letter inline-block">{c}</span>)}
        </div>
        <div className="pl-line mx-auto mt-6 h-px w-48 origin-left bg-gradient-to-r from-transparent via-[#c9a96b] to-transparent" />
        <div className="mt-5 flex items-center justify-center gap-4 text-[9px] tracking-[.35em] text-[#8e8576]">
          <span>FINE FRAGRANCE HOUSE</span><span ref={num} className="text-[#c9a96b]">000</span>
        </div>
      </div>
    </div>
  );
}
