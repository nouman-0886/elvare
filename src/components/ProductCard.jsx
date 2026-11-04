import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import Stage from "./Stage";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <article className="group relative">
      <Link to={`/product/${product.slug}`} className="block" data-cursor="view">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] ring-1 ring-white/10 transition duration-700 group-hover:ring-[#c9a96b]/50">
          <Stage product={product} className="h-full w-full transition duration-[1200ms] ease-out group-hover:scale-[1.04]" />
          <span className="absolute left-4 top-4 border border-white/20 bg-black/25 px-3 py-1 text-[8px] uppercase tracking-[.22em] backdrop-blur-md">{product.family}</span>
          <span className="serif absolute right-4 top-3 text-2xl italic text-white/30">{product.no}</span>
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 transition duration-500 ease-out group-hover:translate-y-0">
            <span className="text-[9px] tracking-[.2em] text-[#ecd6a4]">{product.notes.join(" · ").toUpperCase()}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a96b] text-[#14110c]"><ArrowUpRight size={16} /></span>
          </div>
        </div>
      </Link>
      <div className="flex items-start justify-between gap-3 pt-5">
        <Link to={`/product/${product.slug}`}><h3 className="serif text-[30px] leading-none transition group-hover:text-[#ecd6a4]">{product.name}</h3><p className="mt-2 text-[10px] tracking-[.1em] text-[#8f887c]">{product.subtitle}</p></Link>
        <div className="flex items-center gap-3">
          <span className="pt-1 text-[13px] text-[#c9a96b]">${product.price}</span>
          <button onClick={() => addItem(product, "50ml", 1)} aria-label={`Add ${product.name} to bag`} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[#d8cfbf] transition hover:border-[#c9a96b] hover:bg-[#c9a96b] hover:text-[#14110c]"><Plus size={14} /></button>
        </div>
      </div>
    </article>
  );
}
