import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ShoppingBag, Sparkles } from "lucide-react";
import { useUI } from "../context/UIContext";
import { useCart } from "../context/CartContext";
import { getLenis } from "../lib/scroll";

const links = [["/", "Home"], ["/shop", "Collection"], ["/#story", "Our story"]];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { cartCount, setCartOpen } = useCart();
  const { setFinderOpen } = useUI();
  const close = () => setMenuOpen(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 400 && !menuOpen);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => { const l = getLenis(); menuOpen ? l?.stop() : l?.start(); }, [menuOpen]);

  const linkCls = ({ isActive }) => `group relative py-2 text-[10px] uppercase tracking-[.24em] transition ${isActive ? "text-[#ecd6a4]" : "text-[#c5beb2] hover:text-white"}`;
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[60] transition duration-500 ${hidden ? "-translate-y-full" : "translate-y-0"} ${scrolled ? "border-b border-white/10 bg-[#0c0b09]/70 backdrop-blur-xl" : "border-b border-transparent"}`}>
        <div className={`mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-6 transition-all duration-500 md:px-12 ${scrolled ? "h-[68px]" : "h-[92px]"}`}>
          <nav className="hidden items-center gap-10 md:flex">
            {links.slice(0, 2).map(([to, label]) => <NavLink key={to} to={to} end className={linkCls}>{label}<span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#c9a96b] transition duration-500 group-hover:scale-x-100" /></NavLink>)}
            <Link to="/#story" className="relative py-2 text-[10px] uppercase tracking-[.24em] text-[#c5beb2] transition hover:text-white">Our story</Link>
            <button onClick={() => setFinderOpen(true)} className="flex items-center gap-2 border border-[#c9a96b]/40 px-3.5 py-2 text-[10px] uppercase tracking-[.2em] text-[#ecd6a4] transition hover:bg-[#c9a96b] hover:text-[#14110c]"><Sparkles size={12} /> Scent finder</button>
          </nav>
          <button className="justify-self-start text-[#e9e0d2] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
          <Link to="/" onClick={close} className="text-center">
            <span className="serif block text-[28px] leading-none tracking-[.26em] md:text-[32px]">ÉLVARÉ</span>
            <span className="mt-1.5 block text-[7px] tracking-[.42em] text-[#c9a96b]">FINE FRAGRANCE HOUSE</span>
          </Link>
          <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-3 justify-self-end text-[10px] uppercase tracking-[.2em] text-[#e9e0d2]" aria-label="Open shopping bag">
            <span className="hidden sm:inline">Bag</span>
            <span className="relative"><ShoppingBag size={20} strokeWidth={1.2} />
              <AnimatePresence mode="popLayout"><motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-2.5 -top-2.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#c9a96b] px-1 text-[9px] font-semibold text-[#11100e]">{cartCount}</motion.span></AnimatePresence>
            </span>
          </button>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .7, ease: [.76, 0, .24, 1] }} className="fixed inset-0 z-[55] flex flex-col justify-center gap-8 bg-[#0c0b09] px-9 md:hidden">
            {links.map(([to, label], i) => <motion.div key={to} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 + i * .08, duration: .7 }}><Link onClick={close} to={to} className="serif text-6xl">{label}</Link></motion.div>)}
            <button onClick={() => { close(); setFinderOpen(true); }} className="flex items-center gap-3 text-left text-[#ecd6a4]"><Sparkles size={22} /><span className="serif text-4xl italic">AI Scent finder</span></button>
            <p className="eyebrow mt-8">Small batch · Concept house</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
