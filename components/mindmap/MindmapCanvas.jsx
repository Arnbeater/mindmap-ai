"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeToolbar as ReactFlowNodeToolbar,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
  Handle,
  Position,
} from "reactflow";

import { useMindmapStore } from "@/store/useMindmapStore";
import NodeToolbar from "./NodeToolbar";

function CustomNode({ id, data, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || "");
  const [body, setBody] = useState(data.body || "");

  useEffect(() => {
    setLabel(data.label || "");
    setBody(data.body || "");
  }, [data.label, data.body]);

  useEffect(() => {
    if (!selected) {
      setIsEditing(false);
    }
  }, [selected]);

  const handleSaveInline = () => {
    data.onInlineUpdate?.(id, {
      label: label.trim() || "Untitled node",
      body: body.trim(),
    });
    setIsEditing(false);
  };

  return (
    <div className={`custom-node ${selected ? "selected-node" : ""}`}>
      <Handle type="target" position={Position.Left} />

      {data.canDelete && (
        <button
          type="button"
          className="node-delete-button nodrag nopan"
          onClick={(event) => {
            event.stopPropagation();
            data.onDelete?.(id);
          }}
          aria-label="Delete note"
          title="Delete note"
        >
          ×
        </button>
      )}

      {selected && !isEditing && (
        <button
          type="button"
          className="node-edit-button nodrag nopan"
          onClick={(event) => {
            event.stopPropagation();
            setIsEditing(true);
          }}
        >
          Edit
        </button>
      )}

      {isEditing ? (
        <div className="node-inline-editor nodrag nopan">
          <input
            className="node-inline-input"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Node title"
          />
          <textarea
            className="node-inline-textarea"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Node details"
            rows={3}
          />
          <div className="node-inline-actions">
            <button type="button" className="ui-button" onClick={handleSaveInline}>
              Save
            </button>
            <button
              type="button"
              className="ui-button ui-button-secondary"
              onClick={() => {
                setLabel(data.label || "");
                setBody(data.body || "");
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <strong>{data.label}</strong>
          <p>{data.body}</p>
        </>
      )}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = {
  default: CustomNode,
};

export default function MindmapCanvas({ onOpenInspector }) {
  const storeNodes = useMindmapStore((state) => state.nodes);
  const storeEdges = useMindmapStore((state) => state.edges);
  const selectedNodeId = useMindmapStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useMindmapStore((state) => state.setSelectedNodeId);
  const addChildNode = useMindmapStore((state) => state.addChildNode);
  const deleteSelectedNode = useMindmapStore((state) => state.deleteSelectedNode);
  const deleteNodeById = useMindmapStore((state) => state.deleteNodeById);
  const updateNodeById = useMindmapStore((state) => state.updateNodeById);
  const resetMap = useMindmapStore((state) => state.resetMap);
  const saveToLocal = useMindmapStore((state) => state.saveToLocal);
  const loadFromLocal = useMindmapStore((state) => state.loadFromLocal);
  const setStoreNodes = useMindmapStore((state) => state.setNodes);
  const setStoreEdges = useMindmapStore((state) => state.setEdges);

  const [nodes, setNodes] = useNodesState(storeNodes);
  const [edges, setEdges] = useEdgesState(storeEdges);
  const [loading, setLoading] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    loadFromLocal();
    setIsHydrated(true);
  }, [loadFromLocal]);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      saveToLocal();
    }, 450);

    return () => clearTimeout(timer);
  }, [storeNodes, storeEdges, selectedNodeId, isHydrated, saveToLocal]);

  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  const centerOnNode = useCallback(
    (nodeId, sourceNodes = nodes) => {
      if (!reactFlowInstance || !nodeId) return;

      const node = sourceNodes.find((item) => item.id === nodeId);
      if (!node) return;

      const nodeWidth = node.measured?.width || node.width || 200;
      const nodeHeight = node.measured?.height || node.height || 100;
      const zoom = reactFlowInstance.getZoom();

      reactFlowInstance.setCenter(
        node.position.x + nodeWidth / 2,
        node.position.y + nodeHeight / 2,
        { zoom, duration: 260 }
      );
    },
    [reactFlowInstance, nodes]
  );

  const handleNodesChange = useCallback(
    (changes) => {
      setNodes((currentNodes) => {
        const nextNodes = applyNodeChanges(changes, currentNodes);
        setStoreNodes(nextNodes);
        return nextNodes;
      });
    },
    [setNodes, setStoreNodes]
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      setEdges((currentEdges) => {
        const nextEdges = applyEdgeChanges(changes, currentEdges);
        setStoreEdges(nextEdges);
        return nextEdges;
      });
    },
    [setEdges, setStoreEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((currentEdges) => {
        const nextEdges = addEdge(params, currentEdges);
        setStoreEdges(nextEdges);
        return nextEdges;
      });
    },
    [setEdges, setStoreEdges]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }) => {
      if (selectedNodes?.length) {
        const activeId = selectedNodes[0].id;
        setSelectedNodeId(activeId);
        centerOnNode(activeId);
      }
    },
    [setSelectedNodeId, centerOnNode]
  );

  const onNodeDoubleClick = useCallback(
    (_, node) => {
      setSelectedNodeId(node.id);
      centerOnNode(node.id);
      if (onOpenInspector) onOpenInspector();
    },
    [setSelectedNodeId, centerOnNode, onOpenInspector]
  );

  const handleDeleteNode = useCallback(
    (nodeId) => {
      deleteNodeById(nodeId);
    },
    [deleteNodeById]
  );

  const handleInlineUpdateNode = useCallback(
    (nodeId, payload) => {
      updateNodeById(nodeId, payload);
      const nextNodes = useMindmapStore.getState().nodes;
      setNodes(nextNodes);
      setStoreNodes(nextNodes);
      saveToLocal();
    },
    [updateNodeById, setNodes, setStoreNodes, saveToLocal]
  );

  const mappedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          canDelete: node.id !== "root",
          onDelete: handleDeleteNode,
          onInlineUpdate: handleInlineUpdateNode,
        },
      })),
    [nodes, handleDeleteNode, handleInlineUpdateNode]
  );

  const handleExpand = async () => {
    if (!selectedNodeId) return;

    setLoading(true);

    try {
      const response = await fetch("/api/ai/expand-node", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodeId: selectedNodeId,
          nodes,
          edges,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to expand node");
      }

      const nextNodes = [...nodes, ...result.newNodes];
      const nextEdges = [...edges, ...result.newEdges];
      const newActiveId = result.newNodes?.[0]?.id || selectedNodeId;

      setNodes(nextNodes);
      setEdges(nextEdges);
      setStoreNodes(nextNodes);
      setStoreEdges(nextEdges);
      setSelectedNodeId(newActiveId);
      centerOnNode(newActiveId, nextNodes);
    } catch (error) {
      console.error(error);
      alert(`Expansion failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = () => {
    const newNodeId = addChildNode();
    if (newNodeId) {
      const nextNodes = useMindmapStore.getState().nodes;
      centerOnNode(newNodeId, nextNodes);
    }

    if (onOpenInspector) onOpenInspector();
  };

  const handleDelete = () => {
    deleteSelectedNode();
  };

  const handleReset = () => {
    resetMap();
  };

  const handleSave = () => {
    saveToLocal();
    alert("Project saved locally");
  };

  const handleLoad = () => {
    const project = loadFromLocal();
    alert(`Loaded "${project?.name || "map"}"`);
  };

  return (
    <div className="reactflow-wrapper">
      <ReactFlow
        nodes={mappedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onNodeDoubleClick={onNodeDoubleClick}
        onInit={setReactFlowInstance}
        fitView
      >
        <ReactFlowNodeToolbar
          className="node-toolbar"
          nodeId={selectedNodeId}
          isVisible={Boolean(selectedNodeId)}
          position={Position.Top}
          offset={16}
        >
          <NodeToolbar
            onExpand={handleExpand}
            onAddChild={handleAddChild}
            onDelete={handleDelete}
            onReset={handleReset}
            onSave={handleSave}
            onLoad={handleLoad}
            disabled={loading}
            selectedNodeId={selectedNodeId}
          />
        </ReactFlowNodeToolbar>

        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
