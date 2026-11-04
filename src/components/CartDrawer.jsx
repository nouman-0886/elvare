import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getLenis } from "../lib/scroll";
import Bottle from "./Bottle";

const FREE_SHIP = 100;

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, changeQuantity, removeItem } = useCart();
  useEffect(() => { const l = getLenis(); open ? l?.stop() : l?.start(); return () => l?.start(); }, [open]);
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const progress = Math.min(1, subtotal / FREE_SHIP);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120]">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Close cart overlay" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: .65, ease: [.76, 0, .24, 1] }} className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col border-l border-white/10 bg-[#11100d] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-7 py-6"><div><p className="eyebrow">Your selection</p><h2 className="serif mt-1 text-3xl">Shopping bag</h2></div><button onClick={onClose} aria-label="Close cart"><X /></button></div>
            <div className="border-b border-white/10 px-7 py-4">
              <p className="text-[10px] tracking-[.14em] text-[#a39b8d]">{subtotal >= FREE_SHIP ? "COMPLIMENTARY SHIPPING UNLOCKED" : `$${(FREE_SHIP - subtotal).toFixed(0)} AWAY FROM COMPLIMENTARY SHIPPING`}</p>
              <div className="mt-3 h-[2px] bg-white/10"><motion.div className="h-full bg-gradient-to-r from-[#b8944f] to-[#ecd6a4]" animate={{ width: `${progress * 100}%` }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }} /></div>
            </div>
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-7">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center"><p className="serif text-3xl">Your bag is empty.</p><p className="mt-3 text-xs text-[#928b80]">A signature scent is waiting to be discovered.</p><Link to="/shop" onClick={onClose} className="gold-btn mt-7">Explore collection</Link></div>
              ) : (
                <div className="divide-y divide-white/10">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div key={item.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }} className="flex gap-4 overflow-hidden py-6">
                        <div className="h-28 w-24 shrink-0 overflow-hidden" style={{ background: `radial-gradient(100% 80% at 50% 25%, ${item.product.stage[0]}, ${item.product.stage[1]})` }}><Bottle product={item.product} reflection={false} sheen={false} className="h-full w-full p-1.5" /></div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-3"><div><h3 className="serif text-2xl">{item.product.name}</h3><p className="mt-1 text-[10px] text-[#928b80]">{item.size} · Eau de parfum</p></div><span className="text-sm text-[#c9a96b]">${item.product.price * item.quantity}</span></div>
                          <div className="mt-auto flex items-center gap-4"><div className="flex items-center border border-white/15"><button onClick={() => changeQuantity(item.key, -1)} aria-label="Decrease" className="p-2"><Minus size={12} /></button><span className="w-6 text-center text-xs">{item.quantity}</span><button onClick={() => changeQuantity(item.key, 1)} aria-label="Increase" className="p-2"><Plus size={12} /></button></div><button onClick={() => removeItem(item.key)} aria-label="Remove" className="text-[#8e877b] hover:text-white"><Trash2 size={14} /></button></div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-white/10 px-7 py-6"><div className="flex justify-between text-sm"><span className="text-[#a69e91]">Subtotal</span><span className="text-[#c9a96b]">${subtotal.toFixed(2)}</span></div><p className="mt-2 text-[10px] text-[#81796d]">Shipping and taxes calculated at checkout.</p><button onClick={() => window.alert("Portfolio demo: checkout and payment processing are not connected.")} className="gold-btn mt-6 w-full">Proceed to checkout <ArrowRight size={15} /></button></div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
