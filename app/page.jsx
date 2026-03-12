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
            Build ideas visually. Shape them in the editor. Add AI later.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            className="ui-button ui-button-secondary"
            onClick={() => setShowEditor((prev) => !prev)}
          >
            {showEditor ? "Hide editor" : "Show editor"}
          </button>

          <button
            className="ui-button ui-button-secondary"
            onClick={() => setShowChat((prev) => !prev)}
          >
            {showChat ? "Hide chat" : "Show chat"}
          </button>
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

        {showEditor && (
          <aside className="panel panel-editor">
            <div className="panel-header">
              <h2>Editor</h2>
            </div>

            <div className="panel-body">
              <InspectorPanel />
            </div>
          </aside>
        )}

        {showChat && (
          <aside className="panel panel-chat">
            <div className="panel-header">
              <h2>Chat</h2>
            </div>

            <div className="panel-body">
              <ChatPanel />
            </div>
          </aside>
        )}
      </section>
    </main>
  );
}
