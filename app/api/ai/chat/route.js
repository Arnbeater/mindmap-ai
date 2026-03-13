import { getDefaultModel, getOpenAI } from "@/lib/openai";

const chatSystemPrompt = `
You are a helpful assistant inside a mindmap app.
Give concise, practical advice for brainstorming and structuring ideas.
If users ask for expansion suggestions, provide clear bullet points.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body || {};

    if (!Array.isArray(messages) || !messages.length) {
      return Response.json({ error: "messages is required" }, { status: 400 });
    }

    const safeMessages = messages
      .filter((m) => m && typeof m.content === "string")
      .slice(-10)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: [{ type: "input_text", text: m.content }],
      }));

    if (!safeMessages.length) {
      return Response.json({ error: "No valid messages" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        reply:
          "OpenAI is not configured yet. Add OPENAI_API_KEY in .env.local (or Vercel env vars), then retry.",
        usingFallback: true,
      });
    }

    const client = getOpenAI();
    const completion = await client.responses.create({
      model: getDefaultModel(),
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: chatSystemPrompt }],
        },
        ...safeMessages,
      ],
    });

    const reply = completion.output_text?.trim();

    if (!reply) {
      return Response.json({ error: "Empty AI response" }, { status: 502 });
    }

    return Response.json({ reply, usingFallback: false });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Chat route failed" },
      { status: 500 }
    );
  }
}
