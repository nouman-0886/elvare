// Streams a reply from /api/chat (Groq via serverless). Throws on any failure so callers can fall back.
const ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/api/chat";

export async function streamChat({ messages, shortlist = [], onToken, firstByteMs = 6000 }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), firstByteMs);
  const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages, shortlist }), signal: ctrl.signal });
  if (!res.ok || !res.body) { clearTimeout(timer); throw new Error("llm_unavailable"); }
  const reader = res.body.getReader(), dec = new TextDecoder();
  let buf = "", got = false, full = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop();
    for (const line of lines) {
      const l = line.trim();
      if (!l.startsWith("data:")) continue;
      const data = l.slice(5).trim();
      if (data === "[DONE]") continue;
      try {
        const tok = JSON.parse(data).choices?.[0]?.delta?.content;
        if (tok) { if (!got) { got = true; clearTimeout(timer); } full += tok; onToken(full); }
      } catch { /* ignore keep-alive / partial lines */ }
    }
  }
  clearTimeout(timer);
  if (!full.trim()) throw new Error("empty");
  return full;
}
