"use client";

import { useEffect, useState } from "react";
import { useMindmapStore } from "@/store/useMindmapStore";

export default function InspectorPanel() {
  const nodes = useMindmapStore((state) => state.nodes);
  const selectedNodeId = useMindmapStore((state) => state.selectedNodeId);
  const activeProjectId = useMindmapStore((state) => state.activeProjectId);
  const savedMaps = useMindmapStore((state) => state.savedMaps);
  const updateSelectedNode = useMindmapStore((state) => state.updateSelectedNode);
  const saveToLocal = useMindmapStore((state) => state.saveToLocal);
  const loadFromLocal = useMindmapStore((state) => state.loadFromLocal);
  const createProject = useMindmapStore((state) => state.createProject);
  const deleteProject = useMindmapStore((state) => state.deleteProject);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const activeMap = savedMaps.find((map) => map.id === activeProjectId);

  const [label, setLabel] = useState("");
  const [body, setBody] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedMapId, setSelectedMapId] = useState("");

  useEffect(() => {
    setLabel(selectedNode?.data?.label || "");
    setBody(selectedNode?.data?.body || "");
  }, [selectedNode]);

  useEffect(() => {
    setProjectName(activeMap?.name || "");
    setSelectedMapId(activeProjectId || "");
  }, [activeMap?.name, activeProjectId]);

  const handleSaveNode = () => {
    if (!selectedNode) return;

    updateSelectedNode({
      label: label.trim() || "Untitled node",
      body: body.trim(),
    });

    saveToLocal(projectName);
  };

  const handleSaveMap = () => {
    const map = saveToLocal(projectName);
    if (map) {
      setProjectName(map.name);
      alert(`Saved \"${map.name}\"`);
    }
  };

  const handleCreateMap = () => {
    const map = createProject(projectName || "Untitled map");
    setProjectName(map.name);
  };

  const handleLoadMap = () => {
    if (!selectedMapId) return;

    loadFromLocal(selectedMapId);
  };

  const handleDeleteMap = () => {
    if (!activeProjectId) return;

    const canDelete = confirm("Delete this saved map? This cannot be undone.");
    if (!canDelete) return;

    deleteProject(activeProjectId);
  };

  return (
    <div className="inspector-panel">
      <h3>Map library</h3>

      <label className="inspector-label">Map name</label>
      <input
        className="inspector-input"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="My product strategy"
      />

      <div className="inspector-project-actions">
        <button className="button" onClick={handleSaveMap}>
          Save map
        </button>
        <button className="button button-secondary" onClick={handleCreateMap}>
          New map
        </button>
      </div>

      <label className="inspector-label">Saved maps</label>
      <select
        className="inspector-input"
        value={selectedMapId}
        onChange={(e) => setSelectedMapId(e.target.value)}
      >
        {savedMaps.map((map) => (
          <option key={map.id} value={map.id}>
            {map.name}
          </option>
        ))}
      </select>

      <div className="inspector-project-actions">
        <button className="button button-secondary" onClick={handleLoadMap}>
          Open selected
        </button>
        <button className="button button-danger" onClick={handleDeleteMap}>
          Delete current
        </button>
      </div>

      <h3>Node editor</h3>

      {!selectedNode ? (
        <p className="inspector-empty">Select a node to edit it.</p>
      ) : (
        <>
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

          <button className="button" onClick={handleSaveNode}>
            Save changes
          </button>
        </>
      )}
    </div>
  );
}
