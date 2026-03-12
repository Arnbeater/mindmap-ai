"use client";

export default function NodeToolbar({
  onExpand,
  onAddChild,
  onDelete,
  onReset,
  onSave,
  onLoad,
  disabled,
  selectedNodeId,
}) {
  return (
    <div className="node-toolbar">
      <button
        className="ui-button"
        onClick={onExpand}
        disabled={disabled || !selectedNodeId}
      >
        Expand node
      </button>

      <button
        className="ui-button ui-button-secondary"
        onClick={onAddChild}
        disabled={!selectedNodeId}
      >
        Add child
      </button>

      <button
        className="ui-button ui-button-secondary"
        onClick={onDelete}
        disabled={!selectedNodeId || selectedNodeId === "root"}
      >
        Delete node
      </button>

      <button className="ui-button ui-button-secondary" onClick={onSave}>
        Save
      </button>

      <button className="ui-button ui-button-secondary" onClick={onLoad}>
        Load
      </button>

      <button className="ui-button ui-button-danger" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
