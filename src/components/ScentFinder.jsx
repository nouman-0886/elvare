import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowLeft, ArrowRight, ShoppingBag, RotateCcw, Sparkles } from "lucide-react";
import { QUIZ, recommend } from "../lib/scentAI";
import { useUI } from "../context/UIContext";
import { useCart } from "../context/CartContext";
import { getLenis } from "../lib/scroll";
import Stage from "./Stage";
import Dust from "./Dust";

const STAGES = ["Reading your mood…", "Blending the notes…", "Matching compositions…", "Finding your signature…"];

function Ring({ value }) {
  const r = 46, c = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 110 110" className="-rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2" />
        <motion.circle cx="55" cy="55" r={r} fill="none" stroke="#ecd6a4" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.8, ease: [.22, 1, .36, 1], delay: .3 }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="serif text-4xl text-[#ecd6a4]">{value}<span className="text-xl">%</span></span><span className="text-[7px] tracking-[.25em] text-white/50">MATCH</span></div>
    </div>
  );
}

export default function ScentFinder() {
  const { finderOpen, setFinderOpen } = useUI();
  const { addItem } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState("quiz"); // quiz | thinking | result
  const [msg, setMsg] = useState(0);
  const close = () => setFinderOpen(false);

  const results = useMemo(() => (phase === "result" ? recommend(answers) : []), [phase, answers]);

  useEffect(() => {
    const l = getLenis(); finderOpen ? l?.stop() : l?.start();
    if (finderOpen) { setStep(0); setAnswers({}); setPhase("quiz"); }
    const k = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", k); return () => { window.removeEventListener("keydown", k); l?.start(); };
  }, [finderOpen]);

  useEffect(() => {
    if (phase !== "thinking") return;
    const i = setInterval(() => setMsg((m) => (m + 1) % STAGES.length), 650);
    const t = setTimeout(() => setPhase("result"), 2700);
    return () => { clearInterval(i); clearTimeout(t); };
  }, [phase]);

  const pick = (q, v) => {
    const next = { ...answers, [q.id]: v }; setAnswers(next);
    setTimeout(() => (step < QUIZ.length - 1 ? setStep(step + 1) : (setMsg(0), setPhase("thinking"))), 260);
  };
  const q = QUIZ[step];
  const top = results[0], others = results.slice(1, 3);

  return (
    <AnimatePresence>
      {finderOpen && (
        <motion.div data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }} className="fixed inset-0 z-[130] overflow-y-auto bg-[#0a0907]" role="dialog" aria-modal="true" aria-label="AI Scent Finder">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#4a3519,transparent_65%)]" />
          <Dust count={40} />
          <button onClick={close} aria-label="Close scent finder" className="fixed right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition hover:border-[#c9a96b]"><X size={18} /></button>
          <p className="fixed left-6 top-7 z-10 flex items-center gap-2 text-[10px] tracking-[.3em] text-[#c9a96b]"><Sparkles size={14} /> AI SCENT FINDER</p>

          <div className="relative mx-auto flex min-h-full max-w-[1200px] flex-col justify-center px-6 py-24">
            {phase === "quiz" && (
              <div>
                <div className="mb-10 flex items-center gap-2">{QUIZ.map((_, i) => <span key={i} className="h-[2px] flex-1 overflow-hidden bg-white/10"><motion.span className="block h-full bg-[#c9a96b]" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: .6 }} /></span>)}</div>
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>
                    <p className="eyebrow">Question {step + 1} of {QUIZ.length}</p>
                    <h2 className="serif mt-4 text-5xl font-light leading-[1] md:text-7xl">{q.q}</h2>
                    <p className="mt-3 text-sm text-[#8f887c]">{q.hint}</p>
                    <div className={`mt-10 grid gap-3 ${q.options.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
                      {q.options.map((o) => {
                        const on = answers[q.id] === o.v;
                        return (
                          <button key={String(o.v)} onClick={() => pick(q, o.v)} className={`group relative overflow-hidden border p-6 text-left transition duration-500 ${on ? "border-[#c9a96b] bg-[#c9a96b]/10" : "border-white/15 hover:border-[#c9a96b]/70 hover:bg-white/[.03]"}`}>
                            <span className="serif block text-3xl">{o.t}</span>
                            {o.d && <span className="mt-2 block text-xs leading-5 text-[#8f887c]">{o.d}</span>}
                            <ArrowRight size={16} className="mt-6 text-[#c9a96b] opacity-0 transition duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className="mt-10 inline-flex items-center gap-2 text-[10px] tracking-[.2em] text-[#8f887c] transition hover:text-white disabled:opacity-0"><ArrowLeft size={13} /> BACK</button>
              </div>
            )}

            {phase === "thinking" && (
              <div className="flex flex-col items-center py-20 text-center">
                <div className="relative flex h-56 w-56 items-center justify-center">
                  {[0, 1, 2].map((i) => <motion.span key={i} className="absolute rounded-full border border-[#c9a96b]/50" initial={{ width: 40, height: 40, opacity: .9 }} animate={{ width: 220, height: 220, opacity: 0 }} transition={{ duration: 2.2, repeat: Infinity, delay: i * .7, ease: "easeOut" }} />)}
                  <Sparkles className="text-[#ecd6a4]" size={30} strokeWidth={1.2} />
                </div>
                <AnimatePresence mode="wait"><motion.p key={msg} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="serif mt-4 text-4xl italic text-[#e8dfd0]">{STAGES[msg]}</motion.p></AnimatePresence>
              </div>
            )}

            {phase === "result" && top && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }}>
                <p className="eyebrow">Your signature</p>
                <div className="mt-6 grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
                  <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [.22, 1, .36, 1] }} className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden ring-1 ring-[#c9a96b]/30">
                    <Stage product={top.product} float className="h-full w-full" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-6"><Ring value={top.score} /><div><p className="text-[10px] tracking-[.25em] text-[#8f887c]">N° {top.product.no} · {top.product.family.toUpperCase()}</p><h2 className="serif text-6xl font-light leading-none md:text-7xl">{top.product.name}</h2></div></div>
                    <p className="mt-6 max-w-md text-[15px] leading-7 text-[#a8a091]">{top.product.description}</p>
                    <ul className="mt-6 space-y-2">{top.reasons.map((r, i) => <motion.li key={r} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .9 + i * .18 }} className="flex items-center gap-3 text-sm text-[#d8cfbf]"><Sparkles size={13} className="text-[#c9a96b]" />{r}</motion.li>)}</ul>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <button onClick={() => { addItem(top.product, "50ml", 1); close(); }} className="gold-btn"><ShoppingBag size={15} /> Add to bag · ${top.product.price}</button>
                      <Link to={`/product/${top.product.slug}`} onClick={close} className="outline-btn">View fragrance</Link>
                    </div>
                  </div>
                </div>
                <div className="mt-14 border-t border-white/10 pt-8">
                  <p className="eyebrow">Also in your orbit</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {others.map((r) => (
                      <Link key={r.product.id} to={`/product/${r.product.slug}`} onClick={close} className="group flex items-center gap-5 border border-white/10 p-4 transition hover:border-[#c9a96b]/60">
                        <div className="h-24 w-20 shrink-0 overflow-hidden"><Stage product={r.product} hover={false} className="h-full w-full" /></div>
                        <div className="flex-1"><h3 className="serif text-3xl">{r.product.name}</h3><p className="mt-1 text-[10px] tracking-[.18em] text-[#8f887c]">{r.reasons[0]?.toUpperCase() || r.product.mood.toUpperCase()}</p></div>
                        <span className="serif text-3xl text-[#ecd6a4]">{r.score}%</span>
                      </Link>
                    ))}
                  </div>
                  <button onClick={() => { setStep(0); setAnswers({}); setPhase("quiz"); }} className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[.2em] text-[#8f887c] transition hover:text-white"><RotateCcw size={13} /> RETAKE THE QUIZ</button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
