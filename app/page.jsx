"use client";

import { useState } from "react";
import MindmapCanvas from "@/components/mindmap/MindmapCanvas";
import ChatPanel from "@/components/chat/ChatPanel";
import InspectorPanel from "@/components/sidebar/InspectorPanel";

export default function HomePage() {
  const [showInspector, setShowInspector] = useState(true);
  const [showChat, setShowChat] = useState(true);

  const shellClassName = [
    "app-shell",
    showInspector && showChat
      ? "app-shell-3col"
      : showInspector || showChat
      ? "app-shell-2col"
      : "app-shell-1col",
  ].join(" ");

  return (
    <main className={shellClassName}>
      <section className="canvas-shell">
        <div className="topbar topbar-flex">
          <div>
            <h1>Mindmap AI</h1>
            <p>Build ideas visually. Expand them with AI.</p>
          </div>

          <div className="panel-toggle-group">
            <button
              className="button button-secondary"
              onClick={() => setShowInspector((prev) => !prev)}
            >
              {showInspector ? "Hide editor" : "Show editor"}
            </button>

            <button
              className="button button-secondary"
              onClick={() => setShowChat((prev) => !prev)}
            >
              {showChat ? "Hide chat" : "Show chat"}
            </button>
          </div>
        </div>

        <MindmapCanvas
          onOpenInspector={() => setShowInspector(true)}
        />
      </section>

      {showInspector && (
        <aside className="inspector-shell">
          <InspectorPanel />
        </aside>
      )}

      {showChat && (
        <aside className="chat-shell">
          <ChatPanel />
        </aside>
      )}
    </main>
  );
}
