"use client";

import { useState } from "react";
import MindmapCanvas from "@/components/mindmap/MindmapCanvas";
import InspectorPanel from "@/components/sidebar/InspectorPanel";
import ChatPanel from "@/components/chat/ChatPanel";

export default function HomePage() {
  const [showEditor, setShowEditor] = useState(true);
  const [showChat, setShowChat] = useState(true);

  return (
    <main className="app-shell">
      <header className="app-topbar">
        <div>
          <h1 className="app-title">Mindmap AI</h1>
          <p className="app-subtitle">
            Build ideas visually. Shape them in the editor. Expand with AI branches.
          </p>
        </div>
      </header>

      <section className="workspace">
        <section className="panel panel-canvas">
          <div className="panel-header">
            <h2>Canvas</h2>
          </div>

          <div className="panel-body panel-body-canvas">
            <MindmapCanvas onOpenInspector={() => setShowEditor(true)} />
          </div>
        </section>

        <aside className={`panel panel-editor ${showEditor ? "" : "panel-collapsed"}`}>
          <div className="panel-header">
            <h2>Editor</h2>
            <button
              className="ui-button ui-button-secondary panel-toggle"
              onClick={() => setShowEditor((prev) => !prev)}
              aria-expanded={showEditor}
            >
              {showEditor ? "Hide" : "Show"}
            </button>
          </div>

          {showEditor && (
            <div className="panel-body">
              <InspectorPanel />
            </div>
          )}
        </aside>

        <aside className={`panel panel-chat ${showChat ? "" : "panel-collapsed"}`}>
          <div className="panel-header">
            <h2>Chat</h2>
            <button
              className="ui-button ui-button-secondary panel-toggle"
              onClick={() => setShowChat((prev) => !prev)}
              aria-expanded={showChat}
            >
              {showChat ? "Hide" : "Show"}
            </button>
          </div>

          {showChat && (
            <div className="panel-body">
              <ChatPanel />
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
