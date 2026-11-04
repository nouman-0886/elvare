import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function localChatApi(mode) {
  return {
    name: "local-chat-api",
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), "");
      server.middlewares.use("/api/chat", async (req, res) => {
        try {
          for (const k of ["GROQ_API_KEY", "GROQ_MODEL", "GROQ_BASE_URL"]) if (env[k]) process.env[k] = env[k];
          const chunks = [];
          for await (const c of req) chunks.push(c);
          const body = chunks.length ? Buffer.concat(chunks) : undefined;
          const { default: handler } = await server.ssrLoadModule("/api/chat.js");
          const r = await handler(new Request("http://localhost/api/chat", { method: req.method, body: req.method === "POST" ? body : undefined }));
          res.statusCode = r.status;
          r.headers.forEach((v, k) => res.setHeader(k, v));
          if (!r.body) return res.end();
          const reader = r.body.getReader();
          for (;;) { const { done, value } = await reader.read(); if (done) break; res.write(value); }
          res.end();
        } catch (e) { res.statusCode = 500; res.end(JSON.stringify({ error: "dev_api_failed" })); }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), localChatApi(mode)],
}));