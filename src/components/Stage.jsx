import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Bottle from "./Bottle";

// A lit product "stage": coloured halo, rim light, spotlight that follows the cursor and a 3D-tilting bottle.
export default function Stage({ product, className = "", tilt = 10, size = "h-full", hover = true, fill, float = false }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 }), sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const rotX = useTransform(sy, [0, 1], [tilt * .6, -tilt * .6]);
  const lx = useTransform(sx, (v) => `${v * 100}%`), ly = useTransform(sy, (v) => `${v * 100}%`);
  const move = (e) => { if (!hover) return; const r = ref.current.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); };
  const leave = () => { mx.set(.5); my.set(.5); };
  const [c1, c2] = product.stage;
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`relative overflow-hidden ${className}`} style={{ background: `radial-gradient(120% 90% at 50% 25%, ${c1} 0%, ${c2} 70%)`, perspective: 900 }}>
      <div className="absolute left-1/2 top-[42%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[60px]" style={{ background: product.glow }} />
      <motion.div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-soft-light" style={{ background: useTransform([lx, ly], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,240,205,.8), transparent 45%)`) }} />
      <div className="absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-t from-black/50 to-transparent" />
      <motion.div style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }} className={`relative mx-auto flex ${size} w-full items-center justify-center px-[8%] py-[4%]`}>
        <Bottle product={product} fill={fill} className={`h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.45)] ${float ? "float" : ""}`} />
      </motion.div>
    </div>
  );
}
