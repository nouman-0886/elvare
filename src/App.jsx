import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";
import ScentFinder from "./components/ScentFinder";
import Concierge from "./components/Concierge";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import { useCart } from "./context/CartContext";
import { initScroll, scrollToTop, scrollToId, ScrollTrigger } from "./lib/scroll";

function Page({ children }) {
  return <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .6, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

export default function App() {
  const { cartOpen, setCartOpen } = useCart();
  const location = useLocation();
  const [intro, setIntro] = useState(() => { try { return !sessionStorage.getItem("elvare-intro"); } catch { return true; } });

  useEffect(() => { initScroll(); }, []);
  useEffect(() => {
    if (location.hash) { setTimeout(() => scrollToId(location.hash.slice(1)), 450); }
    else scrollToTop(true);
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <>
      <div className="grain" aria-hidden />
      <Cursor />
      {intro && <Preloader onDone={() => { try { sessionStorage.setItem("elvare-intro", "1"); } catch {} window.__elvareReady = true; window.dispatchEvent(new Event("elvare:ready")); setIntro(false); }} />}
      <Navbar />
      <main>
        <AnimatePresence mode="wait" onExitComplete={() => ScrollTrigger.refresh()}>
          <Page key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Page>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <ScentFinder />
      <Concierge />
    </>
  );
}
