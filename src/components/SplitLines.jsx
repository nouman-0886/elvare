// Splits text into words, each wrapped in an overflow mask so GSAP can slide them up (class: .split-word > span).
export default function SplitLines({ text, className = "", italicFrom = -1 }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="split-word inline-block overflow-hidden pb-[.24em] -mb-[.24em] align-bottom">
          <span className={`inline-block will-change-transform ${italicFrom >= 0 && i >= italicFrom ? "gold-text italic font-light pb-[.22em] -mb-[.22em] pr-[.06em]" : ""}`}>{w}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
