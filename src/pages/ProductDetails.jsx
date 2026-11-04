import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Plus, Minus, ShoppingBag, Check, ChevronDown, Sparkles } from "lucide-react";
import { pairingsFor } from "../lib/scentAI";
import Bottle from "../components/Bottle";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import Stage from "../components/Stage";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";

function Meter({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-[9px] tracking-[.22em] text-[#8f887c]"><span>{label}</span><span className="text-[#c9a96b]">{value}%</span></div>
      <div className="mt-3 h-[2px] bg-white/10"><motion.div className="h-full bg-gradient-to-r from-[#b8944f] to-[#ecd6a4]" initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [.22, 1, .36, 1] }} /></div>
    </div>
  );
}

function Accordion({ title, children, open: o = false }) {
  const [open, setOpen] = useState(o);
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left text-[10px] uppercase tracking-[.22em] text-[#d8cfbf]">{title}<ChevronDown size={15} className={`transition duration-500 ${open ? "rotate-180 text-[#c9a96b]" : ""}`} /></button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: .5, ease: [.22, 1, .36, 1] }} className="overflow-hidden"><div className="pb-6 text-sm leading-7 text-[#a39b8d]">{children}</div></motion.div>
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [size, setSize] = useState("50ml");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  if (!product) return <div className="px-6 py-44 text-center"><h1 className="serif text-5xl">Fragrance not found</h1><Link to="/shop" className="gold-btn mt-8">Back to collection</Link></div>;
  const price = product.price + (size === "30ml" ? -8 : 0);
  const handleAdd = () => { addItem(product, size, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };
  const pairs = pairingsFor(slug);
  const related = products.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="mx-auto grid max-w-[1500px] gap-12 px-6 pb-20 pt-32 md:grid-cols-[1.05fr_1fr] md:gap-20 md:px-14 md:pt-40">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="relative aspect-[4/5] max-h-[820px] overflow-hidden rounded-[3px] ring-1 ring-white/10">
            <Stage product={product} tilt={14} float className="h-full w-full" />
            <span className="absolute left-5 top-5 border border-white/20 bg-black/30 px-3 py-2 text-[9px] uppercase tracking-[.22em] backdrop-blur">{product.family} collection</span>
            <span className="serif absolute right-6 top-4 text-4xl italic text-white/25">N° {product.no}</span>
            <span className="absolute bottom-5 left-5 hidden text-[8px] md:block tracking-[.24em] text-white/50">MOVE YOUR CURSOR TO TILT</span>
          </div>
        </div>
        <div className="flex flex-col justify-center py-4">
          <Link to="/shop" className="mb-10 inline-flex items-center gap-2 text-[9px] tracking-[.2em] text-[#8f887c] transition hover:text-[#c9a96b]"><ArrowLeft size={13} /> BACK TO COLLECTION</Link>
          <Reveal>
            <p className="eyebrow">{product.subtitle}</p>
            <h1 className="serif mt-4 text-7xl font-light leading-none md:text-8xl">{product.name}</h1>
            <p className="mt-3 text-[10px] tracking-[.22em] text-[#8f887c]">{product.mood.toUpperCase()}</p>
            <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#a8a091]">{product.description}</p>
          </Reveal>

          <div className="mt-9 border-y border-white/10 py-7">
            <p className="eyebrow">The composition</p>
            <div className="mt-5 grid grid-cols-3 gap-3">{product.notes.map((n, i) => <div key={n}><span className="text-[8px] tracking-[.2em] text-[#776f63]">{["TOP NOTE", "HEART NOTE", "BASE NOTE"][i]}</span><p className="serif mt-2 text-2xl">{n}</p></div>)}</div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8"><Meter label="LONGEVITY" value={product.longevity} /><Meter label="SILLAGE" value={product.sillage} /></div>
          <p className="mt-6 text-[10px] tracking-[.2em] text-[#8f887c]">BEST WORN · <span className="text-[#d8cfbf]">{product.seasons.join(" · ").toUpperCase()}</span></p>

          <div className="mt-9"><p className="eyebrow">Choose your size</p><div className="mt-4 flex gap-3">{["30ml", "50ml"].map((s) => <button key={s} onClick={() => setSize(s)} className={`min-w-24 border px-5 py-3 text-xs transition ${size === s ? "border-[#c9a96b] bg-[#c9a96b]/10 text-[#ecd6a4]" : "border-white/15 text-[#928b80] hover:border-white/40"}`}>{s}</button>)}</div></div>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <div className="flex items-center border border-white/20"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease" className="p-3"><Minus size={13} /></button><span className="w-7 text-center text-xs">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase" className="p-3"><Plus size={13} /></button></div>
            <span className="serif text-4xl text-[#ecd6a4]">${(price * quantity).toFixed(2)}</span>
          </div>
          <button onClick={handleAdd} className="gold-btn mt-7 w-full sm:w-auto"><ShoppingBag size={15} />{added ? "Added to your bag" : "Add to bag"}{added && <Check size={15} />}</button>

          <div className="mt-10 border-t border-white/10">
            <Accordion title="Details" open>Eau de parfum · 22% fragrance oil · vegan, cruelty-free formulation. Hand-finished in small batches and macerated for 72 hours.</Accordion>
            <Accordion title="Shipping & returns">Complimentary shipping on orders over $100. Unopened bottles may be returned within 30 days.</Accordion>
          </div>
          <p className="mt-5 text-[9px] leading-5 text-[#746d62]">Portfolio concept product. Prices, inventory and checkout are illustrative only.</p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-20 md:px-14">
        <div className="mx-auto max-w-[1400px]">
          <Reveal><p className="eyebrow flex items-center gap-2"><Sparkles size={13} /> AI layering suggestions</p><h2 className="serif mt-3 text-5xl font-light md:text-6xl">Pairs <em className="gold-text">beautifully</em> with</h2></Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {pairs.map((x, i) => (
              <Reveal key={x.product.id} delay={i * .1}>
                <Link to={`/product/${x.product.slug}`} className="group flex items-center gap-6 border border-white/10 p-5 transition duration-500 hover:border-[#c9a96b]/60">
                  <div className="flex shrink-0 items-center"><div className="h-36 w-28 overflow-hidden" style={{ background: `radial-gradient(100% 80% at 50% 25%, ${product.stage[0]}, ${product.stage[1]})` }}><Bottle product={product} reflection={false} sheen={false} className="h-full w-full p-2" /></div><span className="serif -mx-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a96b] text-lg text-[#14110c]">+</span><div className="h-36 w-28 overflow-hidden" style={{ background: `radial-gradient(100% 80% at 50% 25%, ${x.product.stage[0]}, ${x.product.stage[1]})` }}><Bottle product={x.product} reflection={false} sheen={false} className="h-full w-full p-2" /></div></div>
                  <div><h3 className="serif text-3xl transition group-hover:text-[#ecd6a4]">{product.name} + {x.product.name}</h3><p className="mt-3 text-sm leading-6 text-[#a39b8d]">{x.why}</p></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-white/10 pt-24">
        <div className="mx-auto max-w-[1400px]">
          <Reveal><div className="mb-12"><p className="eyebrow">Continue exploring</p><h2 className="serif mt-3 text-5xl font-light md:text-7xl">You may also <em className="gold-text">love.</em></h2></div></Reveal>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{related.map((p, i) => <Reveal key={p.id} delay={i * .1}><ProductCard product={p} /></Reveal>)}</div>
        </div>
      </section>
    </>
  );
}
