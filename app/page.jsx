"use client";

import MindmapCanvas from "@/components/mindmap/MindmapCanvas";
import ChatPanel from "@/components/chat/ChatPanel";

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="canvas-shell">
        <div className="topbar">
          <div>
            <h1>Mindmap AI</h1>
            <p>Build ideas visually. Expand them with AI.</p>
          </div>
        </div>

        <MindmapCanvas />
      </section>

      <aside className="chat-shell">
        <ChatPanel />
      </aside>
    </main>
  );
}
