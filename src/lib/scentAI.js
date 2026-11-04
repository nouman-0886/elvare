import { products } from "../data/products";

/**
 * Client-side "scent intelligence". No backend, no API key.
 * Every product has a weighted taste profile; quiz answers, free-text moods and chat
 * messages are all translated into the same tag space and scored against it.
 * `concierge()` is the single swap point if you later want a real LLM behind the chat.
 */
export const PROFILE = {
  "ambre-noir":  { warm: 1, date: .9, autumn: 1, winter: .8, soft: .4, bold: .4, woody: 1, calm: .2, everyday: .3, intensity: 3 },
  "blanc":       { calm: 1, everyday: 1, summer: .9, spring: .9, fresh: 1, outdoor: .5, soft: .4, intensity: 1 },
  "nocturne":    { bold: 1, date: .8, event: .7, autumn: .8, winter: .9, oud: 1, warm: .4, intensity: 4 },
  "rose-eclat":  { soft: 1, date: .8, event: .7, spring: 1, autumn: .5, floral: 1, calm: .5, warm: .3, intensity: 2 },
  "vert":        { fresh: 1, outdoor: 1, everyday: .8, spring: .8, summer: 1, calm: .6, bold: .1, intensity: 2 },
  "oud-royale":  { bold: .8, event: 1, winter: 1, autumn: .7, oud: 1, warm: .5, date: .4, intensity: 5 },
};

export const QUIZ = [
  { id: "occasion", q: "Where will you wear it most?", hint: "The moment it needs to own.", options: [
    { v: "everyday", t: "Everyday & work", d: "Easy, polished, all day" },
    { v: "date", t: "Date night", d: "Close, magnetic, memorable" },
    { v: "event", t: "Special occasions", d: "Weddings, galas, big entrances" },
    { v: "outdoor", t: "Outdoors & travel", d: "Light, open, energising" } ] },
  { id: "mood", q: "Which mood is you?", hint: "Go with your first instinct.", options: [
    { v: "calm", t: "Calm & clean", d: "Quiet confidence" },
    { v: "warm", t: "Warm & cosy", d: "Golden, enveloping" },
    { v: "bold", t: "Bold & mysterious", d: "Dark, smoky, intriguing" },
    { v: "soft", t: "Soft & romantic", d: "Petals and skin" } ] },
  { id: "season", q: "Your favourite season?", hint: "Scent behaves differently in every climate.", options: [
    { v: "spring", t: "Spring" }, { v: "summer", t: "Summer" }, { v: "autumn", t: "Autumn" }, { v: "winter", t: "Winter" } ] },
  { id: "family", q: "Which note family pulls you in?", hint: "The one you reach for without thinking.", options: [
    { v: "woody", t: "Woody & amber", d: "Cedar, vanilla, resin" },
    { v: "fresh", t: "Fresh & green", d: "Citrus, herbs, musk" },
    { v: "floral", t: "Floral", d: "Rose, peony, neroli" },
    { v: "oud", t: "Oud & smoke", d: "Saffron, patchouli, depth" } ] },
  { id: "intensity", q: "How present should it be?", hint: "Projection — how far the trail travels.", options: [
    { v: 1.5, t: "Subtle", d: "Skin-close, just for you" },
    { v: 3, t: "Noticeable", d: "A pleasant presence" },
    { v: 4.5, t: "A statement", d: "Unmistakable, long-lasting" } ] },
];

const W = { occasion: 1.2, mood: 1.5, season: 1, family: 1, intensity: 1 };
const LABEL = {
  occasion: { everyday: "everyday wear", date: "date nights", event: "special occasions", outdoor: "days outdoors" },
  mood: { calm: "calm & clean", warm: "warm & cosy", bold: "bold & mysterious", soft: "soft & romantic" },
  family: { woody: "woody", fresh: "fresh", floral: "floral", oud: "oud" },
};

export function recommend(answers) {
  const max = Object.keys(W).reduce((s, k) => s + W[k], 0);
  return products.map((p) => {
    const pr = PROFILE[p.slug];
    let total = 0; const reasons = [];
    for (const k of Object.keys(W)) {
      const a = answers[k]; if (a === undefined) continue;
      let s;
      if (k === "intensity") s = Math.max(0, 1 - Math.abs(pr.intensity - a) / 4);
      else s = pr[a] || 0;
      total += s * W[k];
      if (s >= .7) {
        if (k === "intensity") reasons.push(a <= 2 ? "Sits close to the skin, as you like it" : a >= 4 ? "A trail that makes a statement" : "Present without ever shouting");
        else if (k === "season") reasons.push(`Shines in ${a}`);
        else if (k === "family") reasons.push(`A true ${LABEL.family[a]} signature`);
        else if (k === "mood") reasons.push(`Matches your ${LABEL.mood[a]} mood`);
        else reasons.push(`Made for ${LABEL.occasion[a]}`);
      }
    }
    const ratio = total / max;
    return { product: p, score: Math.min(99, Math.round(58 + ratio * 41)), reasons: reasons.slice(0, 3) };
  }).sort((a, b) => b.score - a.score);
}

/* ------------------------------------------------ free-text mood search */
const LEX = [
  [/sard(i|iy)|thand|bar(f|ish)|barsat/, ["winter", "warm"]],
  [/garmi|garm(iyo|iyon)|dhoop|samandar|chutti/, ["summer", "fresh", "outdoor"]],
  [/raat|shaam|mehfil/, ["bold", "date"]],
  [/shaadi|shadi|dawat|taqreeb|eid/, ["event", "soft"]],
  [/pyar|mohabbat|ishq|biwi|shohar|girlfriend|boyfriend/, ["date", "soft", "warm"]],
  [/daftar|kaam|roz(ana)?|college|university/, ["everyday", "calm", "fresh"]],
  [/rain|cozy|cosy|fire|cabin|hug|comfort|blanket|cuddl|sweater|coffee|book/, ["warm", "autumn"]],
  [/beach|ocean|sea\b|sun|vacation|holiday|hot|pool|island|tropic|breez/, ["summer", "fresh", "outdoor"]],
  [/office|work|meeting|clean|shower|morning|minimal|school|class|daily|everyday|casual|simple/, ["everyday", "calm", "fresh"]],
  [/date|romantic|romance|love|dinner|valentine|anniversar|kiss|sensual|intimate/, ["date", "soft", "warm"]],
  [/party|club|night|mystery|myster|dark|smok|bold|confident|seduc|magnet/, ["bold", "date"]],
  [/garden|forest|green|herb|nature|hik|grass|camp|travel|walk|park/, ["outdoor", "fresh"]],
  [/royal|luxur|formal|gala|special|power|king|queen|arab|wedding|event|boss|prestig/, ["event", "bold"]],
  [/winter|snow|cold|christmas|december|chill/, ["winter", "warm"]],
  [/spring|blossom|flower|rose|petal|floral|bloom|soft|gentle|delicate/, ["spring", "soft", "floral"]],
  [/autumn|fall|leaves|october|november|paris|library/, ["autumn", "warm"]],
  [/calm|relax|peace|serene|quiet|zen|spa/, ["calm"]],
  [/wood|cedar|vanilla|amber/, ["woody", "warm"]],
  [/oud|saffron|patchouli|resin/, ["oud", "bold"]],
  [/fresh|citrus|light|airy|crisp|musk|clean/, ["fresh", "calm"]],
];
export function textTags(text) {
  const t = text.toLowerCase(); const tags = new Set();
  LEX.forEach(([re, list]) => re.test(t) && list.forEach((x) => tags.add(x)));
  return [...tags];
}
export function searchMood(text) {
  const tags = textTags(text);
  if (!tags.length) return [];
  return products.map((p) => {
    const pr = PROFILE[p.slug];
    const score = tags.reduce((s, tg) => s + (pr[tg] || 0), 0) / tags.length;
    return { product: p, score, tags };
  }).filter((r) => r.score >= .45).sort((a, b) => b.score - a.score);
}

/* ---------------------------------------------------------- pairings */
const PAIRS = {
  "ambre-noir": [["vert", "Layer Vert on top for a bright citrus lift over the warm amber."], ["rose-eclat", "A touch of Rosé Éclat softens the vanilla into something romantic."]],
  "blanc": [["rose-eclat", "Blanc’s clean musk lets the rose glow — a fresh, modern floral."], ["vert", "Two fresh notes, one airy, one green: a perfect summer duo."]],
  "nocturne": [["ambre-noir", "Amber rounds off Nocturne’s smoke into a warm, enveloping trail."], ["oud-royale", "Double down on oud for a truly dramatic, evening-only signature."]],
  "rose-eclat": [["blanc", "Blanc adds a clean, airy halo around the petals."], ["ambre-noir", "Spray Ambre Noir first for a sensual, vanilla-rose base."]],
  "vert": [["blanc", "Blanc’s white musk smooths Vert’s herbs for daytime ease."], ["nocturne", "A trace of Nocturne at the base gives green notes a smoky edge."]],
  "oud-royale": [["rose-eclat", "Rose over oud is a classic — regal, rich and unexpectedly soft."], ["ambre-noir", "Amber adds golden warmth to Oud Royale’s dark woods."]],
};
export const pairingsFor = (slug) => (PAIRS[slug] || []).map(([s, why]) => ({ product: products.find((p) => p.slug === s), why }));

/* --------------------------------------------------------- concierge */
const nameHit = (t) => products.filter((p) => t.includes(p.name.toLowerCase().replace("é", "e")) || t.includes(p.name.toLowerCase()) || t.includes(p.slug.replace("-", " ")));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function concierge(input) {
  const t = norm(input);
  const budget = (t.match(/(?:under|below|less than|max|upto|up to|within)\s*\$?\s*(\d+)/) || [])[1];
  const cheap = /cheap|affordable|budget|inexpensive/.test(t);
  const limit = budget ? +budget : cheap ? 37 : null;
  const named = nameHit(t);

  if (/^(hi|hello|hey|salam|assalam|aoa|hola)\b/.test(t)) return { text: "Welcome to ÉLVARÉ. Tell me a mood, a moment or a budget — “cosy winter evening”, “gift under $40” — and I’ll find your signature.", chips: ["Cosy winter evening", "Gift under $40", "Something fresh for work"] };
  if (/scent finder|quiz|find my|match me|recommend me|help me (choose|pick|find)/.test(t)) return { text: "Let’s do it properly — five quick questions and I’ll score every fragrance against you.", action: "finder" };
  if (/long(est)?[- ]?(lasting|last)|last(s)? long|stay all day|performance|strongest|beast/.test(t)) {
    const top = [...products].sort((a, b) => b.longevity - a.longevity).slice(0, 2);
    return { text: `For staying power, ${top[0].name} leads at ${top[0].longevity}% longevity, followed by ${top[1].name} at ${top[1].longevity}%.`, products: top };
  }
  if (/compare|vs\.?|versus|difference/.test(t) && named.length >= 2) {
    const [a, b] = named;
    return { text: `${a.name} is ${a.mood.toLowerCase()} — ${a.notes.join(", ")}. ${b.name} is ${b.mood.toLowerCase()} — ${b.notes.join(", ")}. ${a.longevity >= b.longevity ? a.name : b.name} lasts longer; ${a.sillage >= b.sillage ? a.name : b.name} projects more.`, products: [a, b] };
  }
  if (/layer|pair|combine|mix|together/.test(t) && named.length) {
    const p = pairingsFor(named[0].slug)[0];
    return { text: `${p.why}`, products: [named[0], p.product] };
  }
  if (named.length === 1 && !/gift|under|below/.test(t)) {
    const p = named[0];
    return { text: `${p.name} — “${p.subtitle}”. ${p.description} Best worn ${p.seasons.join(" & ").toLowerCase()}.`, products: [p] };
  }

  let ranked = searchMood(input);
  const fam = ["woody", "fresh", "floral", "oud"].find((f) => t.includes(f));
  if (fam && !ranked.length) ranked = products.filter((p) => p.family.toLowerCase() === fam).map((p) => ({ product: p, score: 1 }));
  if (limit) {
    const base = ranked.length ? ranked : products.map((p) => ({ product: p, score: .5 }));
    ranked = base.filter((r) => r.product.price <= limit).sort((a, b) => b.score - a.score || a.product.price - b.product.price);
    if (!ranked.length) return { text: `Our collection starts at $${Math.min(...products.map((p) => p.price))}, so nothing falls under $${limit} just yet. Shall I show the most accessible options?`, chips: ["Show cheapest"], products: [...products].sort((a, b) => a.price - b.price).slice(0, 2) };
  }
  if (/cheapest|lowest price|show cheapest/.test(t)) return { text: "Here are the most accessible compositions — all full-size eau de parfum.", products: [...products].sort((a, b) => a.price - b.price).slice(0, 3) };
  if (/gift/.test(t) && !ranked.length) ranked = [products[3], products[0], products[1]].map((p) => ({ product: p, score: 1 }));
  if (ranked.length) {
    const top = ranked.slice(0, 3).map((r) => r.product);
    const lead = /gift/.test(t) ? "Gifting well is about being safe and memorable — " : "";
    return { text: `${lead}${top[0].name} is my first pick: ${top[0].mood.toLowerCase()}, with ${top[0].notes.join(", ").toLowerCase()}.${top[1] ? ` ${top[1].name} is a close second.` : ""}`, products: top };
  }
  return { text: "I read scent through moods, moments and notes. Try “rainy evening in Paris”, “something for a summer wedding” or “strongest oud under $50”.", chips: ["Rainy evening", "Summer wedding", "Strongest fragrance"] };
}
