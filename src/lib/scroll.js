import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
export const getLenis = () => lenis;

export function initScroll() {
  if (lenis) return lenis;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  lenis = new Lenis({ duration: reduce ? 0 : 1.15, smoothWheel: !reduce, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}
export { gsap, ScrollTrigger };
