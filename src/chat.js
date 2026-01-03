export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      // ===== API CHAT =====
      if (url.pathname === "/api/chat") {
        if (request.method !== "POST") {
          return new Response("POST only", { status: 405 });
        }

        const body = await request.json().catch(() => null);
        if (!body || !body.message) {
          return Response.json(
            { error: "message required" },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/deepseek-ai/deepseek-r1-distill-qwen-7b",
          {
            messages: [
              {
                role: "system",
                content:
                  "Jawab dalam bahasa Indonesia. Gunakan reasoning internal, " +
                  "tapi jangan tampilkan proses berpikir. Jawaban final saja."
              },
              { role: "user", content: body.message }
            ],
            temperature: 0.6,
            max_tokens: 400
          }
        );

        return Response.json({ answer: result.response });
      }

      // ===== STATIC FILE =====
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }

      return new Response("Not Found", { status: 404 });

    } catch (err) {
      return new Response(
        "Worker error: " + err.message,
        { status: 500 }
      );
    }
  }
};
