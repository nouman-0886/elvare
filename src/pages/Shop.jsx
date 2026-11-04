import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { searchMood } from "../lib/scentAI";
import { useUI } from "../context/UIContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import Dust from "../components/Dust";

const categories = ["All", "Woody", "Fresh", "Floral", "Oud"];

export default function Shop() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const { setFinderOpen } = useUI();
  const ai = useMemo(() => (search.trim().length > 2 ? searchMood(search) : []), [search]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const byText = (p) => `${p.name} ${p.subtitle} ${p.notes.join(" ")} ${p.family}`.toLowerCase().includes(q);
    const aiIds = new Map(ai.map((r) => [r.product.id, r.score]));
    let r = products.filter((p) => (category === "All" || p.family === category) && (!q || byText(p) || aiIds.has(p.id)));
    if (ai.length && sort === "featured") r = [...r].sort((a, b) => (aiIds.get(b.id) || 0) - (aiIds.get(a.id) || 0));
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [category, search, sort, ai]);
  return (
    <div className="min-h-[70vh]">
      <section className="relative overflow-hidden border-b border-white/10 px-6 pb-24 pt-44 text-center md:pb-32 md:pt-56">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#4a3519,transparent_68%)]" />
        <Dust count={36} />
        <Reveal><p className="eyebrow relative">Explore ÉLVARÉ</p><h1 className="serif relative mt-6 text-7xl font-light md:text-[9rem] md:leading-none">The <em className="gold-text">collection.</em></h1><p className="relative mx-auto mt-6 max-w-md text-[15px] leading-7 text-[#a39b8d]">Distinctive compositions, each with its own mood and memory.</p></Reveal>
      </section>
      <section className="section-pad pt-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-2">{categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`relative border px-5 py-2.5 text-[9px] uppercase tracking-[.2em] transition ${category === c ? "border-[#c9a96b] text-[#14110c]" : "border-white/15 text-[#aaa294] hover:border-[#c9a96b]"}`}>
                {category === c && <motion.span layoutId="chip" className="absolute inset-0 bg-[#c9a96b]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{c}</span>
              </button>))}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 border-b border-white/20 px-2 py-2 transition focus-within:border-[#c9a96b]"><Search size={14} className="text-[#8f887c]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Try “rainy evening in Paris”" className="w-44 bg-transparent text-xs placeholder:text-[#716a60] sm:w-60" /></label>
              <label className="flex items-center gap-2 border-b border-white/20 px-2 py-2"><SlidersHorizontal size={14} className="text-[#8f887c]" /><select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-xs text-[#c5beb2] outline-none"><option className="bg-[#171511]" value="featured">Featured</option><option className="bg-[#171511]" value="low">Price: low to high</option><option className="bg-[#171511]" value="high">Price: high to low</option><option className="bg-[#171511]" value="name">Name: A–Z</option></select></label>
            </div>
          </div>
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <p className="text-[9px] tracking-[.2em] text-[#777064]">{filtered.length} FRAGRANCES</p>
            {ai.length > 0 && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 border border-[#c9a96b]/40 px-3 py-1.5 text-[9px] tracking-[.18em] text-[#ecd6a4]"><Sparkles size={12} /> AI MATCHED TO YOUR MOOD</motion.p>}
            <button onClick={() => setFinderOpen(true)} className="ml-auto flex items-center gap-2 text-[9px] tracking-[.2em] text-[#c9a96b] transition hover:text-white"><Sparkles size={12} /> NOT SURE? TAKE THE SCENT QUIZ</button>
          </div>
          {filtered.length ? (
            <motion.div layout className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => <motion.div layout key={p.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .94 }} transition={{ duration: .7, delay: (i % 3) * .07, ease: [.22, 1, .36, 1] }}><ProductCard product={p} /></motion.div>)}
              </AnimatePresence>
            </motion.div>
          ) : <div className="py-24 text-center"><p className="serif text-3xl">No fragrances found.</p><button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-5 text-xs text-[#c9a96b] underline">Clear filters</button></div>}
        </div>
      </section>
    </div>
  );
}
