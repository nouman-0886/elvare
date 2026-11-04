import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X, ArrowUp, Plus } from "lucide-react";
import { concierge } from "../lib/scentAI";
import { streamChat } from "../lib/llm";
import { useUI } from "../context/UIContext";
import { useCart } from "../context/CartContext";
import Bottle from "./Bottle";

const START = [{ from: "bot", text: "Hello, I’m your ÉLVARÉ scent concierge. Describe a mood, a moment or a budget — I’ll find your fragrance.", chips: ["Cosy winter evening", "Gift under $40", "Longest lasting", "Take the scent quiz"] }];

export default function Concierge() {
  const { chatOpen, setChatOpen, setFinderOpen } = useUI();
  const { addItem } = useCart();
  const [msgs, setMsgs] = useState(START);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing, chatOpen]);

  const send = async (raw) => {
    const t = (raw ?? text).trim(); if (!t || typing) return;
    const history = [...msgs, { from: "me", text: t }];
    setMsgs(history); setText(""); setTyping(true);

    // 1) instant local answer: product cards + fallback text (also decides quiz hand-off)
    const local = concierge(t);
    if (local.action === "finder") {
      setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { from: "bot", ...local }]); setTimeout(() => { setChatOpen(false); setFinderOpen(true); }, 900); }, 600);
      return;
    }

    // 2) real LLM (Groq, streamed). Product cards show the moment the first token lands.
    const llmMessages = history.map((m) => ({ role: m.from === "me" ? "user" : "assistant", content: m.text }));
    let started = false;
    try {
      await streamChat({
        messages: llmMessages, shortlist: (local.products || []).map((p) => p.name),
        onToken: (full) => {
          if (!started) { started = true; setTyping(false); setMsgs((m) => [...m, { from: "bot", text: full, products: local.products, chips: local.chips, streaming: true }]); }
          else setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, text: full } : x)));
        },
      });
      setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, streaming: false } : x)));
    } catch {
      // 3) graceful fallback: local engine answer (no key / offline / rate-limited / slow)
      setTyping(false);
      if (started) setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, streaming: false } : x)));
      else setMsgs((m) => [...m, { from: "bot", ...local }]);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!chatOpen && (
          <motion.button initial={{ opacity: 0, y: 20, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: .9 }} transition={{ delay: 3.2 }} onClick={() => setChatOpen(true)} aria-label="Ask ÉLVARÉ scent concierge" className="fixed bottom-5 right-5 z-[80] flex items-center gap-3 rounded-full border border-[#c9a96b]/50 bg-[#14110c]/90 py-3 pl-4 pr-5 text-[10px] tracking-[.2em] text-[#ecd6a4] shadow-[0_10px_40px_-10px_rgba(201,169,107,.5)] backdrop-blur-xl transition hover:bg-[#c9a96b] hover:text-[#14110c]">
            <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#c9a96b]" /><span className="relative h-2 w-2 rounded-full bg-[#ecd6a4]" /></span><Sparkles size={15} /> ASK ÉLVARÉ
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chatOpen && (
          <motion.section initial={{ opacity: 0, y: 30, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .96 }} transition={{ duration: .45, ease: [.22, 1, .36, 1] }} className="fixed inset-x-3 bottom-3 z-[85] flex h-[min(640px,calc(100svh-24px))] flex-col overflow-hidden border border-[#c9a96b]/30 bg-[#100e0a]/95 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[400px]" aria-label="Scent concierge chat">
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#b8944f] to-[#ecd6a4] text-[#14110c]"><Sparkles size={16} /></span><div><p className="serif text-xl leading-none">Ask ÉLVARÉ</p><p className="mt-1 text-[8px] tracking-[.25em] text-[#c9a96b]">AI SCENT CONCIERGE</p></div></div>
              <button onClick={() => setChatOpen(false)} aria-label="Close chat"><X size={18} /></button>
            </header>
            <div data-lenis-prevent className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={m.from === "me" ? "flex justify-end" : ""}>
                  <div className={m.from === "me" ? "max-w-[85%] bg-[#c9a96b] px-4 py-3 text-sm text-[#14110c]" : "max-w-[92%]"}>
                    <p className={m.from === "me" ? "" : "text-sm leading-6 text-[#d8cfbf]"}>{m.text}{m.streaming && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#c9a96b]" />}</p>
                    {m.products && <div className="mt-3 space-y-2">{m.products.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 border border-white/10 bg-white/[.03] p-2 pr-3">
                        <Link to={`/product/${p.slug}`} onClick={() => setChatOpen(false)} className="h-16 w-14 shrink-0 overflow-hidden" style={{ background: `radial-gradient(100% 80% at 50% 25%, ${p.stage[0]}, ${p.stage[1]})` }}><Bottle product={p} reflection={false} sheen={false} className="h-full w-full p-1" /></Link>
                        <Link to={`/product/${p.slug}`} onClick={() => setChatOpen(false)} className="min-w-0 flex-1"><p className="serif text-xl leading-none">{p.name}</p><p className="mt-1 truncate text-[9px] tracking-[.12em] text-[#8f887c]">{p.notes.join(" · ").toUpperCase()}</p></Link>
                        <span className="text-xs text-[#c9a96b]">${p.price}</span>
                        <button onClick={() => addItem(p, "50ml", 1)} aria-label={`Add ${p.name} to bag`} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 transition hover:border-[#c9a96b] hover:bg-[#c9a96b] hover:text-[#14110c]"><Plus size={13} /></button>
                      </div>))}</div>}
                    {m.chips && <div className="mt-3 flex flex-wrap gap-2">{m.chips.map((c) => <button key={c} onClick={() => send(c)} className="border border-[#c9a96b]/40 px-3 py-1.5 text-[10px] tracking-[.08em] text-[#ecd6a4] transition hover:bg-[#c9a96b] hover:text-[#14110c]">{c}</button>)}</div>}
                  </div>
                </motion.div>
              ))}
              {typing && <div className="flex gap-1.5 py-2">{[0, 1, 2].map((i) => <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-[#c9a96b]" animate={{ opacity: [.3, 1, .3], y: [0, -3, 0] }} transition={{ duration: .9, repeat: Infinity, delay: i * .15 }} />)}</div>}
              <div ref={end} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-3 border-t border-white/10 px-4 py-3">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. rainy evening, under $40…" aria-label="Message" className="flex-1 bg-transparent px-1 py-2 text-sm placeholder:text-[#6f695f]" />
              <button aria-label="Send" disabled={!text.trim()} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a96b] text-[#14110c] transition disabled:opacity-30"><ArrowUp size={16} /></button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
