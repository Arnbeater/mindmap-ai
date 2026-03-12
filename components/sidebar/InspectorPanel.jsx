"use client";

import { useEffect, useState } from "react";
import { useMindmapStore } from "@/store/useMindmapStore";

export default function InspectorPanel() {
  const nodes = useMindmapStore((state) => state.nodes);
  const selectedNodeId = useMindmapStore((state) => state.selectedNodeId);
  const updateSelectedNode = useMindmapStore((state) => state.updateSelectedNode);
  const saveToLocal = useMindmapStore((state) => state.saveToLocal);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const [label, setLabel] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setLabel(selectedNode?.data?.label || "");
    setBody(selectedNode?.data?.body || "");
  }, [selectedNode]);

  const handleSave = () => {
    if (!selectedNode) return;

    updateSelectedNode({
      label: label.trim() || "Untitled node",
      body: body.trim(),
    });

    saveToLocal();
  };

  if (!selectedNode) {
    return (
      <div className="inspector-panel">
        <h3>Node editor</h3>
        <p className="inspector-empty">Select a node to edit it.</p>
      </div>
    );
  }

  return (
    <div className="inspector-panel">
      <h3>Node editor</h3>

      <label className="inspector-label">Title</label>
      <input
        className="inspector-input"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Node title"
      />

      <label className="inspector-label">Description</label>
      <textarea
        className="inspector-textarea"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Describe the idea"
      />

      <button className="button" onClick={handleSave}>
        Save changes
      </button>
    </div>
  );
}
