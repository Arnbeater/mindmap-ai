"use client";

export default function NodeToolbar({ onExpand, disabled, selectedNodeId }) {
  return (
    <div className="node-toolbar">
      <button
        className="button"
        onClick={onExpand}
        disabled={disabled || !selectedNodeId}
      >
        Expand node with AI
      </button>
    </div>
  );
}
