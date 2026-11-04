import { useRef } from "react";
import gsap from "gsap";

// Wrapper that gently pulls its child toward the pointer.
export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: .4, ease: "power3.out" });
  };
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: .9, ease: "elastic.out(1,.4)" });
  return <span ref={ref} onPointerMove={move} onPointerLeave={leave} className={`inline-block ${className}`}>{children}</span>;
}
