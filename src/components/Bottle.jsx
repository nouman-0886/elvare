import { useId } from "react";

/**
 * Procedurally rendered perfume bottle (pure SVG).
 * Layered like real glass: thick base, tinted liquid with meniscus, dip tube,
 * paper label, metallic cap, specular highlights, caustic glow and a floor reflection.
 * Every product gets its own silhouette + palette from data/products.js.
 */
const VB_W = 320, VB_H = 480, FLOOR = 380, CX = 160;

function bodyPath(shape, x, y, w, h, r) {
  const b = y + h;
  switch (shape) {
    case "shoulder": {
      const s = 30;
      return `M${x + r},${b} Q${x},${b} ${x},${b - r} L${x},${y + 56} Q${x},${y + 12} ${x + s},${y + 6} L${x + w - s},${y + 6} Q${x + w},${y + 12} ${x + w},${y + 56} L${x + w},${b - r} Q${x + w},${b} ${x + w - r},${b}Z`;
    }
    case "crystal": {
      const c = 16;
      return `M${x + c},${y} L${x + w - c},${y} L${x + w},${y + c} L${x + w},${b - 10} L${x + w - 10},${b} L${x + 10},${b} L${x},${b - 10} L${x},${y + c}Z`;
    }
    default: {
      const rr = Math.min(r, w / 2, h / 2);
      return `M${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${b - rr} Q${x + w},${b} ${x + w - rr},${b} L${x + rr},${b} Q${x},${b} ${x},${b - rr} L${x},${y + rr} Q${x},${y} ${x + rr},${y}Z`;
    }
  }
}

export default function Bottle({ product, fill = 0.82, reflection = true, sheen = true, className = "", title }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n) => `${n}-${uid}`;
  const b = product.bottle;
  const dark = product.slug === "nocturne" || product.slug === "oud-royale";

  const x = CX - b.w / 2;
  const bottom = FLOOR;
  const y = bottom - b.h;
  const thick = 9;                       // side glass thickness
  const baseThick = b.shape === "crystal" ? 26 : 18; // heavy glass base
  const neckW = b.capW * 0.52;
  const neckTop = y - 14;
  const capBottom = neckTop + 4;
  const capTop = capBottom - b.capH;
  const capX = CX - b.capW / 2;

  const outer = bodyPath(b.shape, x, y, b.w, b.h, b.r);
  const innerH = b.h - baseThick - 10;
  const inner = bodyPath(b.shape === "crystal" ? "block" : b.shape, x + thick, y + 12, b.w - thick * 2, innerH, Math.max(4, b.r - thick));
  const liquidTravel = innerH * (1 - fill);
  const [l1, l2, l3] = b.liquid;
  const [c1, c2, c3] = b.cap;

  const labelW = b.w * 0.66;
  const labelH = Math.min(86, b.h * 0.36);
  const labelX = CX - labelW / 2;
  const labelY = y + b.h * 0.34;
  const tone = dark ? { bg: "#16120e", fg: "#e6cf9a", line: "#c9a45e" } : { bg: "#f1e9d8", fg: "#2a2118", line: "#9a7a3e" };

  const Capsule = () => {
    const rad = b.shape === "round" ? 18 : b.shape === "crystal" ? 3 : 8;
    return (
      <g>
        {/* neck */}
        <rect x={CX - neckW / 2} y={neckTop - 2} width={neckW} height={22} fill={`url(#${id("glass")})`} stroke="#ffffff55" strokeWidth=".8" />
        <rect x={CX - neckW / 2 + 3} y={neckTop + 6} width={neckW - 6} height={14} fill={l2} opacity=".45" />
        {/* cap body */}
        <rect x={capX} y={capTop} width={b.capW} height={b.capH} rx={rad} fill={`url(#${id("metal")})`} />
        <rect x={capX} y={capTop} width={b.capW} height={b.capH} rx={rad} fill={`url(#${id("metalV")})`} />
        {b.shape === "crystal" && (
          <g stroke="#ffffff66" strokeWidth=".8" fill="none">
            <path d={`M${capX},${capTop + 14} L${capX + b.capW},${capTop + 14}`} />
            <path d={`M${CX},${capTop} L${CX},${capTop + b.capH}`} opacity=".4" />
          </g>
        )}
        {/* fine machined ridges */}
        <g stroke="#000" strokeOpacity=".18" strokeWidth=".7">
          {[0.62, 0.72, 0.82].map((t) => <line key={t} x1={capX + 3} x2={capX + b.capW - 3} y1={capTop + b.capH * t} y2={capTop + b.capH * t} />)}
        </g>
        {/* top highlight */}
        <rect x={capX + 5} y={capTop + 3} width={b.capW - 10} height="3" rx="1.5" fill="#fff" opacity=".55" />
        <rect x={capX + b.capW * 0.14} y={capTop + 8} width={b.capW * 0.1} height={b.capH - 16} rx="3" fill="#fff" opacity=".35" />
        {/* collar */}
        <rect x={capX - 1} y={capBottom - 7} width={b.capW + 2} height="7" rx="2" fill={b.collar || c2} />
        <rect x={capX - 1} y={capBottom - 7} width={b.capW + 2} height="2" rx="1" fill="#fff" opacity=".4" />
      </g>
    );
  };

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className={className} role="img" aria-label={title || `${product.name} eau de parfum bottle`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={id("glass")} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={b.glass + 0.12} />
          <stop offset=".18" stopColor="#fff" stopOpacity={b.glass * 0.25} />
          <stop offset=".55" stopColor="#fff" stopOpacity={b.glass * 0.1} />
          <stop offset=".85" stopColor="#fff" stopOpacity={b.glass * 0.35} />
          <stop offset="1" stopColor="#fff" stopOpacity={b.glass + 0.18} />
        </linearGradient>
        <linearGradient id={id("liq")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={l1} />
          <stop offset=".5" stopColor={l2} />
          <stop offset="1" stopColor={l3} />
        </linearGradient>
        <linearGradient id={id("cyl")} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".55" />
          <stop offset=".16" stopColor="#000" stopOpacity=".05" />
          <stop offset=".34" stopColor="#fff" stopOpacity=".12" />
          <stop offset=".7" stopColor="#000" stopOpacity=".1" />
          <stop offset="1" stopColor="#000" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id={id("metal")} x1="0" x2="1">
          <stop offset="0" stopColor={c3} />
          <stop offset=".18" stopColor={c1} />
          <stop offset=".34" stopColor={c2} />
          <stop offset=".52" stopColor={c1} />
          <stop offset=".78" stopColor={c2} />
          <stop offset="1" stopColor={c3} />
        </linearGradient>
        <linearGradient id={id("metalV")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset=".25" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".38" />
        </linearGradient>
        <linearGradient id={id("spec")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".6" stopColor="#fff" stopOpacity=".25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("sweep")} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".38" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("fadeG")} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={FLOOR} y2={FLOOR - 95}>
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={id("fade")} maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
          <rect width={VB_W} height={VB_H} fill={`url(#${id("fadeG")})`} />
        </mask>
        <radialGradient id={id("caustic")}>
          <stop offset="0" stopColor={l1} stopOpacity=".75" />
          <stop offset="1" stopColor={l2} stopOpacity="0" />
        </radialGradient>
        <filter id={id("blur")} x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="6" /></filter>
        <filter id={id("soft")}><feGaussianBlur stdDeviation="1.1" /></filter>
        <clipPath id={id("outer")}><path d={outer} /></clipPath>
        <clipPath id={id("inner")}><path d={inner} /></clipPath>

        <g id={id("art")}>
          {/* glass body */}
          <path d={outer} fill={`url(#${id("glass")})`} />
          {/* liquid */}
          <g clipPath={`url(#${id("inner")})`}>
            <g style={{ transform: `translateY(${liquidTravel}px)`, transition: "transform 1.1s cubic-bezier(.22,1,.36,1)" }}>
              <rect x={x} y={y + 12} width={b.w} height={innerH + 4} fill={`url(#${id("liq")})`} />
              <rect x={x} y={y + 12} width={b.w} height={innerH + 4} fill={`url(#${id("cyl")})`} />
              <ellipse cx={CX} cy={y + 12} rx={b.w / 2 - thick} ry="3.2" fill="#fff" opacity=".5" />
              {/* micro bubbles */}
              <g fill="#fff" opacity=".35">
                <circle cx={CX - b.w * 0.2} cy={y + innerH * 0.7} r="1.3" />
                <circle cx={CX + b.w * 0.18} cy={y + innerH * 0.45} r="1" />
                <circle cx={CX + b.w * 0.3} cy={y + innerH * 0.82} r="1.6" />
              </g>
            </g>
          </g>
          {/* heavy glass base: refracts + darkens */}
          <g clipPath={`url(#${id("outer")})`}>
            <rect x={x} y={bottom - baseThick} width={b.w} height={baseThick} fill="#fff" opacity=".1" />
            <rect x={x} y={bottom - baseThick} width={b.w} height="1.2" fill="#fff" opacity=".55" />
            <rect x={x + b.w * 0.2} y={bottom - baseThick + 4} width={b.w * 0.6} height={baseThick - 9} rx="4" fill={l2} opacity=".28" />
          </g>
          {/* dip tube */}
          <line x1={CX + b.w * 0.14} x2={CX + b.w * 0.14} y1={y - 6} y2={bottom - baseThick - 6} stroke="#fff" strokeOpacity=".28" strokeWidth="1.4" />
          {/* label */}
          <g>
            <rect x={labelX} y={labelY} width={labelW} height={labelH} fill={tone.bg} opacity=".94" />
            <rect x={labelX + 4} y={labelY + 4} width={labelW - 8} height={labelH - 8} fill="none" stroke={tone.line} strokeWidth=".7" />
            <text x={CX} y={labelY + labelH * 0.34} textAnchor="middle" fill={tone.fg} fontFamily="'Cormorant Garamond',serif" fontSize={Math.min(17, labelW / 6)} letterSpacing="3">ÉLVARÉ</text>
            <line x1={CX - 10} x2={CX + 10} y1={labelY + labelH * 0.46} y2={labelY + labelH * 0.46} stroke={tone.line} strokeWidth=".7" />
            <text x={CX} y={labelY + labelH * 0.64} textAnchor="middle" fill={tone.fg} fontFamily="'DM Sans',sans-serif" fontSize="4.6" letterSpacing="1.5">N° {product.no} · {product.name.toUpperCase()}</text>
            <text x={CX} y={labelY + labelH * 0.82} textAnchor="middle" fill={tone.fg} opacity=".7" fontFamily="'DM Sans',sans-serif" fontSize="3.8" letterSpacing="1.4">EAU DE PARFUM · 50 ML</text>
            <rect x={labelX} y={labelY} width={labelW} height={labelH} fill={`url(#${id("cyl")})`} opacity=".55" />
          </g>
          {/* edges */}
          <path d={outer} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.1" />
          <path d={inner} fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth=".8" />
          {/* specular highlights */}
          <rect x={x + 8} y={y + 20} width={b.w * 0.07} height={b.h * 0.62} rx={b.w * 0.035} fill={`url(#${id("spec")})`} opacity=".85" />
          <rect x={x + b.w * 0.2} y={y + 24} width="2.4" height={b.h * 0.3} rx="1.2" fill="#fff" opacity=".4" />
          <rect x={x + b.w - 14} y={y + 26} width="3" height={b.h * 0.5} rx="1.5" fill="#fff" opacity=".28" />
          {b.shape === "crystal" && (
            <g stroke="#fff" strokeOpacity=".3" strokeWidth=".8" fill="none">
              <path d={`M${x + 16},${y} L${x + 28},${y + 20} L${x + 28},${bottom - 10}`} />
              <path d={`M${x + b.w - 16},${y} L${x + b.w - 28},${y + 20} L${x + b.w - 28},${bottom - 10}`} />
            </g>
          )}
          {/* moving light sweep */}
          {sheen && (
            <g clipPath={`url(#${id("outer")})`}>
              <rect className="bottle-sweep" x={x - b.w} y={y} width={b.w * 0.6} height={b.h} fill={`url(#${id("sweep")})`} transform="skewX(-14)" />
            </g>
          )}
          {Capsule()}
        </g>
      </defs>

      {/* ground glow + shadow */}
      <ellipse cx={CX} cy={FLOOR + 6} rx={b.w * 0.78} ry="9" fill="#000" opacity=".6" filter={`url(#${id("blur")})`} />
      <ellipse cx={CX} cy={FLOOR + 4} rx={b.w * 0.62} ry="9" fill={`url(#${id("caustic")})`} opacity=".55" />

      {reflection && (
        <g transform={`translate(0 ${FLOOR * 2}) scale(1 -1)`} mask={`url(#${id("fade")})`} opacity=".7" filter={`url(#${id("soft")})`}>
          <use href={`#${id("art")}`} />
        </g>
      )}
      <use href={`#${id("art")}`} />
    </svg>
  );
}
