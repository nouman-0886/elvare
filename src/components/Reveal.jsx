import { motion } from "motion/react";
export default function Reveal({ children, delay = 0, className = "", y = 36 }) {
  return <motion.div className={className} initial={{ opacity: 0, y, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: .95, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
