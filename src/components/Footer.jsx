import { Link } from "react-router-dom";
import { Instagram, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#090806] px-6 pt-20 md:px-12">
      <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <p className="serif max-w-sm text-3xl leading-tight text-[#e8dfd0]">Fragrance is the art of <em className="gold-text">leaving a little of yourself behind.</em></p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-[#c5beb2]">
            <Link to="/shop" className="transition hover:translate-x-1 hover:text-[#c9a96b]">The collection</Link>
            <Link to="/#story" className="transition hover:translate-x-1 hover:text-[#c9a96b]">Our philosophy</Link>
            <a href="mailto:hello@elvare.example" className="transition hover:translate-x-1 hover:text-[#c9a96b]">Contact</a>
          </div>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-xs text-[#aaa294] transition hover:text-[#c9a96b]"><Instagram size={15} /> Instagram</a>
        </div>
        <div>
          <p className="eyebrow">Stay in the know</p>
          <p className="mt-6 text-xs leading-6 text-[#8f887c]">Occasional notes on new compositions and the art of scent.</p>
          <form className="mt-4 flex border-b border-white/25 pb-3 transition focus-within:border-[#c9a96b]" onSubmit={(e) => { e.preventDefault(); window.alert("Thank you — this portfolio demo does not store email addresses."); e.target.reset(); }}>
            <input type="email" required placeholder="Your email address" className="w-full bg-transparent text-sm placeholder:text-[#6f695f]" />
            <button aria-label="Subscribe" className="text-[#c9a96b]"><ArrowUpRight /></button>
          </form>
        </div>
      </div>
      <Reveal y={60}><div aria-hidden className="serif pointer-events-none mt-16 select-none text-center text-[22vw] leading-[.78] tracking-[.04em] outline-text md:text-[19vw]">ÉLVARÉ</div></Reveal>
      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col justify-between gap-3 border-t border-white/10 py-6 text-[9px] tracking-[.14em] text-[#6f695f] sm:flex-row">
        <span>© {new Date().getFullYear()} ÉLVARÉ FRAGRANCE HOUSE</span>
        <span>CONCEPT STORE · PORTFOLIO DEMONSTRATION</span>
      </div>
    </footer>
  );
}
