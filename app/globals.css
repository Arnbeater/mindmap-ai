"use client";

import { useState } from "react";
import MindmapCanvas from "@/components/mindmap/MindmapCanvas";
import ChatPanel from "@/components/chat/ChatPanel";
import InspectorPanel from "@/components/sidebar/InspectorPanel";

export default function HomePage() {
  const [showInspector, setShowInspector] = useState(true);
  const [showChat, setShowChat] = useState(true);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#f3f4f6",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          padding: "16px 20px",
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
          flex: "0 0 auto",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px" }}>Mindmap AI</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
            Build ideas visually. Expand them with AI.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
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

      <section
        style={{
          display: "flex",
          flex: "1 1 auto",
          minHeight: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <section
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            minHeight: 0,
            position: "relative",
            background: "#f3f4f6",
          }}
        >
          <MindmapCanvas onOpenInspector={() => setShowInspector(true)} />
        </section>

        {showInspector && (
          <aside
            style={{
              width: "320px",
              minWidth: "320px",
              borderLeft: "1px solid #e5e7eb",
              background: "#ffffff",
              overflow: "auto",
            }}
          >
            <InspectorPanel />
          </aside>
        )}

        {showChat && (
          <aside
            style={{
              width: "340px",
              minWidth: "340px",
              borderLeft: "1px solid #e5e7eb",
              background: "#ffffff",
              overflow: "auto",
            }}
          >
            <ChatPanel />
          </aside>
        )}
      </section>
    </main>
  );
}
