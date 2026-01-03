export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API endpoint
    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return new Response("POST only", { status: 405 });
      }

      const { message } = await request.json();
      if (!message) {
        return Response.json({ error: "message required" }, { status: 400 });
      }

      // DeepSeek tetap berpikir DI BACKEND
      const result = await env.AI.run(
        "@cf/deepseek-ai/deepseek-r1-distill-qwen-7b",
        {
          messages: [
            {
              role: "system",
              content:
                "Jawab dalam bahasa Indonesia. " +
                "Gunakan reasoning internal tapi JANGAN tampilkan proses berpikir. " +
                "Berikan hanya jawaban final."
            },
            { role: "user", content: message }
          ],
          temperature: 0.6,
          max_tokens: 400
        }
      );

      return Response.json({
        answer: result.response
      });
    }

    // Serve static HTML
    return env.ASSETS.fetch(request);
  }
};
