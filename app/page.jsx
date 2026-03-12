"use client";

import { useState } from "react";
import MindmapCanvas from "@/components/mindmap/MindmapCanvas";
import ChatPanel from "@/components/chat/ChatPanel";
import InspectorPanel from "@/components/sidebar/InspectorPanel";

export default function HomePage() {
  const [showInspector, setShowInspector] = useState(true);
  const [showChat, setShowChat] = useState(true);

  return (
    <main className="app-root">
      <header className="app-header">
        <div>
          <h1>Mindmap AI</h1>
          <p>Build ideas visually. Expand them with AI.</p>
        </div>

        <div className="header-actions">
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
      </header>

      <section className="workspace">
        <section className="canvas-column">
          <MindmapCanvas onOpenInspector={() => setShowInspector(true)} />
        </section>

        {showInspector && (
          <aside className="side-column inspector-column">
            <InspectorPanel />
          </aside>
        )}

        {showChat && (
          <aside className="side-column chat-column">
            <ChatPanel />
          </aside>
        )}
      </section>
    </main>
  );
}
