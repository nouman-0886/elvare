import { useEffect, useRef } from "react";

// Drifting gold dust / mist motes on a canvas. Cheap: ~60 particles, paused when off-screen.
export default function Dust({ count = 60, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w, h, raf, visible = true;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const ps = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .3, vy: -(Math.random() * .25 + .05), vx: (Math.random() - .5) * .15, a: Math.random() * .6 + .15, t: Math.random() * 6 }));
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx + Math.sin(p.t += .01) * .12; p.y += p.vy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(236,214,164,${p.a})`); g.addColorStop(1, "rgba(236,214,164,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 7); ctx.fill();
      }
    };
    draw();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}
