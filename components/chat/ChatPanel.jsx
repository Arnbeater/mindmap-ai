"use client";

import { useState } from "react";

export default function ChatPanel() {
  const [messages] = useState([
    {
      id: "m1",
      role: "assistant",
      content:
        "Chat is not wired to the AI yet. Right now only 'Expand node with AI' is meant to work.",
    },
  ]);

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.role === "user" ? "user" : ""}`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="chat-input-wrap">
        <textarea
          className="chat-input"
          placeholder="Chat comes in next version"
          disabled
        />

        <div className="chat-actions">
          <button className="button" disabled>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
