// Vercel Edge Function: streams a Groq chat completion straight back to the browser.
// The API key lives only here (env var GROQ_API_KEY) and never reaches the client.
import { products } from "../src/data/products.js";

export const config = { runtime: "edge" };

const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

const catalogue = products
  .map((p) => `- ${p.name} (${p.family}, $${p.price}): ${p.description} Notes: ${p.notes.join(", ")}. Mood: ${p.mood}. Best in ${p.seasons.join("/")}. Longevity ${p.longevity}%, sillage ${p.sillage}%.`)
  .join("\n");

const system = (shortlist) => `You are the scent concierge of ÉLVARÉ, a luxury fragrance house. Be warm, elegant and concise.
RULES: Recommend ONLY from the catalogue below. Never invent products, notes, prices or discounts. Reply in at most 60 words, plain text, no markdown, no lists. Reply in the user's language (English, Urdu or Roman Urdu). If the question is unrelated to fragrance, politely steer back to scent.
CATALOGUE:
${catalogue}
${shortlist.length ? `The shop already shows these matching products to the customer: ${shortlist.join(", ")}. Refer to them by name and explain briefly why they fit.` : ""}`;

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const key = process.env.GROQ_API_KEY;
  if (!key) return json({ error: "no_key" }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400); }
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "bad_messages" }, 400);

  const names = new Set(products.map((p) => p.name));
  const shortlist = (Array.isArray(body.shortlist) ? body.shortlist : []).filter((n) => names.has(n)).slice(0, 3);

  const upstream = await fetch(`${process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify((() => {
      const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b"; // fastest Groq production model; override via env
      const isReasoner = /gpt-oss/.test(model);
      return {
        model, stream: true, temperature: 0.7,
        // gpt-oss "thinks" first; keep it short so the first word arrives quickly, and leave room for the answer
        ...(isReasoner ? { reasoning_effort: "low", max_completion_tokens: 600 } : { max_tokens: 200 }),
        messages: [{ role: "system", content: system(shortlist) }, ...messages],
      };
    })()),
  }).catch((e) => ({ networkError: String(e?.message || e) }));

  // Surface WHY Groq refused (never contains your key) so it can be fixed quickly.
  if (upstream.networkError) return json({ error: "upstream", reason: "network", detail: upstream.networkError }, 502);
  if (!upstream.ok || !upstream.body) {
    let detail = "";
    try { const j = await upstream.json(); detail = j?.error?.message || JSON.stringify(j); } catch { /* ignore */ }
    console.error("Groq error", upstream.status, detail);
    return json({ error: "upstream", status: upstream.status, detail: String(detail).slice(0, 300) }, 502);
  }
  return new Response(upstream.body, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-store" } });
}
