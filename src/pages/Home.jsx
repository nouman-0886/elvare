import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { useUI } from "../context/UIContext";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "../lib/scroll";
import { products, ingredients, reviews } from "../data/products";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import Bottle from "../components/Bottle";
import Stage from "../components/Stage";
import Dust from "../components/Dust";
import SplitLines from "../components/SplitLines";
import Magnetic from "../components/Magnetic";

const hero = products[0];

/* ---------------------------------------------------------------- HERO */
function Hero() {
  const root = useRef(null), bottle = useRef(null), halo = useRef(null), rings = useRef(null);

  useEffect(() => {
    let readyListener = null;
    const ctx = gsap.context(() => {
      const play = () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".h-eyebrow", { opacity: 0, y: 20, duration: 1 })
          .from(".hero-title .split-word > span", { yPercent: 120, rotate: 4, duration: 1.4, stagger: .1 }, "-=.7")
          .from(".h-copy", { opacity: 0, y: 24, duration: 1.1 }, "-=.9")
          .from(".h-cta > *", { opacity: 0, y: 24, stagger: .1, duration: 1 }, "-=.9")
          .from(bottle.current, { opacity: 0, y: 120, scale: .9, duration: 1.8, ease: "expo.out" }, 0)
          .from(halo.current, { opacity: 0, scale: .4, duration: 2.2 }, 0)
          .from(".h-ring", { opacity: 0, scale: .7, stagger: .15, duration: 1.8 }, .2)
          .from(".h-meta", { opacity: 0, y: 20, stagger: .12, duration: 1 }, "-=1");
      };
      if (window.__elvareReady || sessionStorage.getItem("elvare-intro")) play();
      else {
        // run once the preloader finishes; the listener is removed on cleanup so React StrictMode
        // (dev double-mount) can't start two competing timelines
        readyListener = () => ctx.add(play);
        window.addEventListener("elvare:ready", readyListener, { once: true });
      }

      // scroll parallax
      gsap.to(bottle.current, { yPercent: -14, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".h-left", { yPercent: 18, opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: true } });
      gsap.to(rings.current, { rotate: 40, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });

      // pointer parallax (desktop)
      const bx = gsap.quickTo(".h-depth", "x", { duration: 1.2, ease: "power3" });
      const by = gsap.quickTo(".h-depth", "y", { duration: 1.2, ease: "power3" });
      const hx = gsap.quickTo(halo.current, "x", { duration: 1.6, ease: "power3" });
      const hy = gsap.quickTo(halo.current, "y", { duration: 1.6, ease: "power3" });
      const move = (e) => {
        const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
        bx(nx * -26); by(ny * -18); hx(nx * 50); hy(ny * 36);
        gsap.to(".h-tilt", { rotateY: nx * 14, rotateX: ny * -8, duration: 1.2, ease: "power3" });
      };
      if (matchMedia("(hover:hover)").matches) window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    }, root);
    return () => { if (readyListener) window.removeEventListener("elvare:ready", readyListener); ctx.revert(); };
  }, []);

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_46%,#4b3418_0%,#1d160d_34%,#0c0b09_72%)]" />
      <div className="absolute inset-0 opacity-[.35]" style={{ background: "conic-gradient(from 200deg at 72% 40%, transparent 0 62%, rgba(236,214,164,.18) 70%, transparent 78%)" }} />
      <Dust count={70} />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1560px] items-center px-6 pb-24 pt-32 md:grid-cols-[1.05fr_1fr] md:px-14">
        <div className="h-left relative z-10 order-2 md:order-1">
          <p className="h-eyebrow eyebrow flex items-center gap-4"><span className="h-px w-10 bg-[#c9a96b]" />The essence of distinction</p>
          <h1 className="hero-title serif mt-7 text-[68px] font-light leading-[.86] tracking-[-.035em] sm:text-[92px] md:text-[112px] xl:text-[136px]">
            <SplitLines text="Scent is" /><br /><SplitLines text="a signature." italicFrom={0} />
          </h1>
          <p className="h-copy mt-9 max-w-[420px] text-[15px] leading-7 text-[#a8a091]">Compositions with character. Created for the moments that become memories — and the presence that stays long after.</p>
          <div className="h-cta mt-10 flex flex-wrap items-center gap-7">
            <Magnetic><Link to="/shop" className="gold-btn">Discover the collection <ArrowRight size={15} /></Link></Magnetic>
            <Link to="/#story" className="group flex items-center gap-3 text-[10px] tracking-[.22em] text-[#b8ad9c] transition hover:text-white"><span className="h-px w-8 bg-[#8e7958] transition-all duration-500 group-hover:w-14" />OUR PHILOSOPHY</Link>
          </div>
        </div>

        <div className="relative order-1 md:order-2">
          <div className="relative mx-auto h-[56svh] w-full max-w-[520px] md:h-[76svh]">
            <div ref={halo} className="absolute left-1/2 top-1/2 h-[80%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b9772e]/30 blur-[90px]" />
            <div ref={rings} className="absolute inset-0 flex items-center justify-center">
              <div className="h-ring absolute h-[88%] w-[88%] rounded-full border border-[#c9a96b]/20" />
              <div className="h-ring absolute h-[66%] w-[66%] rounded-full border border-dashed border-[#c9a96b]/25" />
            </div>
            <div className="h-depth absolute inset-0" style={{ perspective: 1100 }}>
              <div ref={bottle} className="absolute inset-0">
                <div className="h-tilt h-full w-full" style={{ transformStyle: "preserve-3d" }}>
                  <Bottle product={hero} className="float h-full w-full drop-shadow-[0_40px_60px_rgba(0,0,0,.55)]" />
                </div>
              </div>
            </div>
            <svg className="spin-slow absolute -left-2 bottom-[14%] hidden h-28 w-28 md:block" viewBox="0 0 120 120" aria-hidden>
              <defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
              <text fontSize="9.2" letterSpacing="3.4" fill="#c9a96b" fontFamily="DM Sans"><textPath href="#circ">EAU DE PARFUM • SMALL BATCH • EST. 2026 •</textPath></text>
              <circle cx="60" cy="60" r="3" fill="#c9a96b" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-6 px-6 py-5 text-[9px] tracking-[.24em] text-[#857d70] md:px-14">
          <span className="h-meta hidden sm:inline">N° 01 · AMBRE NOIR · 50 ML</span>
          <span className="h-meta flex items-center gap-2 text-[#a39b8d]">SCROLL <ArrowDown size={12} className="animate-bounce" /></span>
          <span className="h-meta hidden sm:inline">SMALL BATCH · DISTINCTIVE BY DESIGN</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- MARQUEE */
function Marquee() {
  const words = ["Amber", "Oud", "Neroli", "Saffron", "Vetiver", "Damask Rose", "Cedarwood", "Tonka"];
  const row = (k) => words.map((w, i) => <span key={k + i} className="flex items-center"><span className={`serif px-8 text-6xl md:text-8xl ${i % 2 ? "italic text-[#c9a96b]/85" : "outline-text"}`}>{w}</span><span className="text-[#c9a96b]/60">✦</span></span>);
  return <div className="overflow-hidden border-y border-white/10 py-7"><div className="marquee">{row("a")}{row("b")}</div></div>;
}

/* ---------------------------------------------------------- COLLECTION */
function Featured() {
  return (
    <section id="featured" className="section-pad">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="eyebrow">The collection</p><h2 className="serif mt-4 text-6xl font-light md:text-8xl">Find your <em className="gold-text">signature.</em></h2></div>
          <Link to="/shop" className="group flex items-center gap-3 text-[10px] tracking-[.22em] text-[#c9a96b]">VIEW ALL FRAGRANCES <ArrowRight size={14} className="transition group-hover:translate-x-2" /></Link>
        </div></Reveal>
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p, i) => <Reveal key={p.id} delay={i * .12} className={i === 1 ? "lg:mt-16" : ""}><ProductCard product={p} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- AI FINDER CTA */
function FinderCTA() {
  const { setFinderOpen } = useUI();
  return (
    <section className="px-6 pb-10 md:px-14">
      <Reveal>
        <div className="relative mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 overflow-hidden border border-[#c9a96b]/30 bg-[radial-gradient(ellipse_at_85%_50%,#4a3519,#12100c_65%)] p-8 md:flex-row md:items-center md:p-14">
          <Dust count={22} />
          <div className="relative max-w-xl">
            <p className="eyebrow flex items-center gap-2"><Sparkles size={13} /> New · AI scent finder</p>
            <h2 className="serif mt-4 text-5xl font-light leading-[.95] md:text-7xl">Not sure where <em className="gold-text">to begin?</em></h2>
            <p className="mt-5 text-[15px] leading-7 text-[#a8a091]">Answer five quick questions. Our scent intelligence scores every fragrance against your mood, season and style — and shows your match.</p>
          </div>
          <div className="relative flex flex-col gap-3 sm:flex-row md:flex-col"><Magnetic><button onClick={() => setFinderOpen(true)} className="gold-btn"><Sparkles size={15} /> Find my signature</button></Magnetic><p className="text-[9px] tracking-[.2em] text-[#8f887c]">TAKES 30 SECONDS · NO SIGN-UP</p></div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------- PINNED SCENT JOURNEY */
const journey = [
  { tag: "Top note", title: "Amber", copy: "The first spark. Golden, resinous and instantly warm — it opens like a lit match in a velvet room.", fill: .38 },
  { tag: "Heart note", title: "Black vanilla", copy: "Dark, smooth and impossibly soft. The heart deepens as the fragrance meets your skin.", fill: .62 },
  { tag: "Base note", title: "Cedarwood", copy: "Dry, quiet and endless. The trail that remains hours later — long after you have left the room.", fill: .88 },
];
function Journey() {
  const root = useRef(null), bar = useRef(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current, start: "top top", end: "+=240%", pin: true, scrub: true,
        onUpdate: (s) => { setStep(Math.min(2, Math.floor(s.progress * 3))); gsap.set(bar.current, { scaleY: s.progress }); },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-[#0e0c09]">
      <motion.div className="absolute inset-0" animate={{ background: ["radial-gradient(ellipse at 28% 55%,#5a3a16,#0e0c09 62%)", "radial-gradient(ellipse at 28% 55%,#3a2518,#0e0c09 62%)", "radial-gradient(ellipse at 28% 55%,#4a3420,#0e0c09 62%)"][step] }} transition={{ duration: 1.2 }} />
      <div className="relative mx-auto grid h-full max-w-[1400px] items-center gap-6 px-6 pt-20 md:grid-cols-2 md:px-14 md:pt-0">
        <div className="relative mx-auto h-[44svh] w-full max-w-[420px] md:h-[78svh]"><Bottle product={hero} fill={journey[step].fill} className="h-full w-full drop-shadow-[0_40px_50px_rgba(0,0,0,.5)]" /></div>
        <div className="relative h-[40svh] md:h-[50svh]">
          <p className="eyebrow">The scent journey</p>
          <div className="relative mt-6 h-full">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 40, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -30, filter: "blur(8px)" }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }} className="absolute inset-0">
                <span className="serif text-[22vw] italic leading-none text-white/[.06] md:text-[12rem]">0{step + 1}</span>
                <p className="eyebrow -mt-10 md:-mt-20">{journey[step].tag}</p>
                <h3 className="serif mt-3 text-6xl font-light md:text-8xl">{journey[step].title}</h3>
                <p className="mt-5 max-w-md text-[15px] leading-7 text-[#a8a091]">{journey[step].copy}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[10%] right-6 top-[18%] w-px bg-white/10 md:right-14"><div ref={bar} className="pin-line h-full origin-top scale-y-0" /></div>
    </section>
  );
}

/* ---------------------------------------------------------------- STORY */
function Counter({ to, suffix = "", label }) {
  const el = useRef(null);
  useEffect(() => {
    const o = { v: 0 };
    const t = gsap.to(o, { v: to, duration: 2.2, ease: "power3.out", scrollTrigger: { trigger: el.current, start: "top 88%", once: true }, onUpdate: () => { if (el.current) el.current.textContent = Math.round(o.v) + suffix; } });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, [to, suffix]);
  return <div><div ref={el} className="serif text-5xl text-[#ecd6a4] md:text-6xl">0{suffix}</div><p className="mt-2 text-[9px] tracking-[.22em] text-[#8f887c]">{label}</p></div>;
}
function Story() {
  const img = useRef(null);
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const t = gsap.fromTo(img.current, { yPercent: -9, scale: 1.18 }, { yPercent: 9, scale: 1.18, ease: "none", scrollTrigger: { trigger: img.current.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return (
    <section id="story" className="grid bg-[#12100c] md:grid-cols-2">
      <div className="relative min-h-[520px] overflow-hidden md:min-h-[760px]" style={{ background: "radial-gradient(circle at 40% 40%,#5a4020,#14100a)" }}>
        <div ref={img} className="absolute inset-0">
          {ok && <img src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1600&q=85" onError={() => setOk(false)} alt="Perfume ingredients and botanical textures" className="h-full w-full object-cover opacity-80" />}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/80 via-transparent to-[#0c0b09]/30" />
        <div className="absolute inset-x-0 bottom-[8%] top-[6%] flex justify-center"><div className="float h-full w-[62%] max-w-[380px]"><Bottle product={products[5]} className="h-full w-full drop-shadow-[0_40px_50px_rgba(0,0,0,.6)]" /></div></div>
        <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between"><span className="serif text-3xl italic text-white/80">Maison ÉLVARÉ</span><span className="text-[9px] tracking-[.25em] text-white/60">EST. 2026</span></div>
      </div>
      <div className="flex items-center px-8 py-24 md:px-[10%]">
        <Reveal>
          <p className="eyebrow">Beyond the bottle</p>
          <h2 className="serif mt-6 text-6xl font-light leading-[.92] md:text-8xl">Made to be<br /><em className="gold-text">remembered.</em></h2>
          <p className="mt-8 max-w-md text-[15px] leading-7 text-[#a8a091]">We believe a fragrance should feel personal, never predictable. ÉLVARÉ explores the balance between familiar notes and unexpected contrasts — thoughtful compositions with a point of view.</p>
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8"><Counter to={22} suffix="%" label="PURE ESSENCE" /><Counter to={72} suffix="h" label="MACERATION" /><Counter to={6} label="SIGNATURES" /></div>
          <Link to="/shop" className="outline-btn mt-12">Explore our world <ArrowRight size={14} /></Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- INGREDIENTS */
function Ingredients() {
  const [active, setActive] = useState(0);
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-14 max-w-2xl"><p className="eyebrow">Sourced with intent</p><h2 className="serif mt-4 text-6xl font-light md:text-8xl">Raw materials, <em className="gold-text">rare by nature.</em></h2></div></Reveal>
        <div className="flex h-[640px] flex-col gap-3 md:h-[520px] md:flex-row">
          {ingredients.map((g, i) => (
            <motion.button key={g.name} layout onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-pressed={active === i}
              className="group relative overflow-hidden text-left" style={{ flex: active === i ? 4 : 1, transition: "flex .9s cubic-bezier(.22,1,.36,1)", background: `linear-gradient(160deg, ${g.hue}, #0e0c09 85%)` }}>
              <div className="absolute inset-0 opacity-0 mix-blend-soft-light transition duration-700 group-hover:opacity-60" style={{ background: "radial-gradient(circle at 30% 20%,#fff,transparent 55%)" }} />
              <div className="absolute inset-0 bg-black/20 transition duration-700" style={{ opacity: active === i ? 0 : .45 }} />
              <span className="serif absolute left-5 top-4 text-3xl italic text-white/40">0{i + 1}</span>
              <div className="absolute inset-x-5 bottom-6">
                <p className={`text-[9px] tracking-[.24em] text-white/60 transition ${active === i ? "" : "md:opacity-0"}`}>{g.origin.toUpperCase()}</p>
                <h3 className={`serif mt-2 whitespace-nowrap transition-all duration-700 ${active === i ? "text-4xl md:text-5xl" : "text-3xl md:rotate-180 md:text-4xl md:[writing-mode:vertical-rl]"}`}>{g.name}</h3>
                <p className="mt-3 max-w-[240px] text-xs leading-6 text-white/75 transition duration-700" style={{ opacity: active === i ? 1 : 0, transform: active === i ? "none" : "translateY(10px)" }}>{g.note}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- REVIEWS */
function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 5200); return () => clearInterval(t); }, []);
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#100e0a] px-6 py-28 text-center md:py-40">
      <span className="serif pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 text-[22rem] leading-none text-[#c9a96b]/[.07]">“</span>
      <div className="relative mx-auto max-w-4xl">
        <p className="eyebrow">In their words</p>
        <div className="relative mt-10 h-[270px] md:h-[230px]">
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, y: 24, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -18, filter: "blur(6px)" }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }} className="absolute inset-0">
              <blockquote className="serif text-3xl font-light italic leading-[1.2] md:text-5xl">“{reviews[i].quote}”</blockquote>
              <figcaption className="mt-8 text-[10px] tracking-[.26em] text-[#c9a96b]">{reviews[i].who.toUpperCase()} · {reviews[i].for.toUpperCase()}</figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex justify-center gap-3">{reviews.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={`Review ${k + 1}`} className={`h-[2px] transition-all duration-500 ${k === i ? "w-12 bg-[#c9a96b]" : "w-6 bg-white/20"}`} />)}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CTA */
function CTA() {
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".cta-b").forEach((el, i) => gsap.fromTo(el, { yPercent: 18 + i * 6 }, { yPercent: -18 - i * 6, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }));
    }, root);
    return () => ctx.revert();
  }, []);
  const trio = [products[3], products[2], products[5]];
  return (
    <section ref={root} className="relative overflow-hidden px-6 py-32 text-center md:py-44">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,#4a3417,#0c0b09_70%)]" />
      <Dust count={40} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[46%] items-end justify-center gap-0 opacity-60 md:opacity-90">
        {trio.map((p, i) => <div key={p.id} className="cta-b h-full w-[34%] max-w-[330px]" style={{ marginLeft: i ? "-4%" : 0, zIndex: i === 1 ? 2 : 1, transform: "scale(" + (i === 1 ? 1 : .85) + ")" }}><Bottle product={p} reflection={false} className="h-full w-full" /></div>)}
      </div>
      <div className="relative z-10">
        <Reveal>
          <p className="eyebrow">Your next signature awaits</p>
          <h2 className="serif mx-auto mt-6 max-w-4xl text-6xl font-light leading-[.92] md:text-9xl">Leave an impression.<br /><em className="gold-text">Not a trace.</em></h2>
          <div className="mt-12"><Magnetic><Link to="/shop" className="gold-btn">Shop the collection <ArrowRight size={15} /></Link></Magnetic></div>
        </Reveal>
      </div>
      <div className="h-[34vh] md:h-[40vh]" />
    </section>
  );
}

export default function Home() {
  return <><Hero /><Marquee /><Featured /><FinderCTA /><Journey /><Story /><Ingredients /><Reviews /><CTA /></>;
}
