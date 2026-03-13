"use client";

import { useMemo, useState } from "react";

const initialMessages = [
  {
    role: "assistant",
    content:
      "Hi! I can help you brainstorm and structure your mindmap. Ask me what to build next.",
  },
];

export default function ChatPanel() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const canSend = useMemo(() => draft.trim().length > 0 && !loading, [draft, loading]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Chat failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.reply,
        },
      ]);

      if (result.usingFallback) {
        setStatus("Using setup guidance until OPENAI_API_KEY is configured.");
      }
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel-inner">
        <h3>Assistant</h3>

        <div className="chat-thread">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`chat-message ${message.role === "user" ? "chat-message-user" : ""}`}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div className="chat-compose">
          <textarea
            className="chat-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for ideas, outlines, or next branches..."
            rows={3}
          />
          <button className="ui-button" onClick={handleSend} disabled={!canSend}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        {status && <p className="chat-status">{status}</p>}
      </div>
    </div>
  );
}
