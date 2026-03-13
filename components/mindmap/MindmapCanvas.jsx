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

      <strong>{data.label}</strong>
      <p>{data.body}</p>
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
  const addExpandedNodes = useMindmapStore((state) => state.addExpandedNodes);
  const addChildNode = useMindmapStore((state) => state.addChildNode);
  const deleteSelectedNode = useMindmapStore((state) => state.deleteSelectedNode);
  const deleteNodeById = useMindmapStore((state) => state.deleteNodeById);
  const resetMap = useMindmapStore((state) => state.resetMap);
  const saveToLocal = useMindmapStore((state) => state.saveToLocal);
  const loadFromLocal = useMindmapStore((state) => state.loadFromLocal);
  const setStoreNodes = useMindmapStore((state) => state.setNodes);
  const setStoreEdges = useMindmapStore((state) => state.setEdges);

  const [nodes, setNodes] = useNodesState(storeNodes);
  const [edges, setEdges] = useEdgesState(storeEdges);
  const [loading, setLoading] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  useEffect(() => {
    loadFromLocal();
  }, [loadFromLocal]);

  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  useEffect(() => {
    if (!reactFlowInstance || !selectedNodeId) return;

    const activeNode = nodes.find((node) => node.id === selectedNodeId);
    if (!activeNode) return;

    const nodeWidth = activeNode.measured?.width || activeNode.width || 200;
    const nodeHeight = activeNode.measured?.height || activeNode.height || 100;
    const zoom = reactFlowInstance.getZoom();

    reactFlowInstance.setCenter(
      activeNode.position.x + nodeWidth / 2,
      activeNode.position.y + nodeHeight / 2,
      { zoom, duration: 260 }
    );
  }, [reactFlowInstance, selectedNodeId]);

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
        setSelectedNodeId(selectedNodes[0].id);
      }
    },
    [setSelectedNodeId]
  );

  const onNodeDoubleClick = useCallback(
    (_, node) => {
      setSelectedNodeId(node.id);
      if (onOpenInspector) onOpenInspector();
    },
    [setSelectedNodeId, onOpenInspector]
  );

  const handleDeleteNode = useCallback(
    (nodeId) => {
      deleteNodeById(nodeId);
    },
    [deleteNodeById]
  );

  const mappedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          canDelete: node.id !== "root",
          onDelete: handleDeleteNode,
        },
      })),
    [nodes, handleDeleteNode]
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

      setNodes(nextNodes);
      setEdges(nextEdges);
      setStoreNodes(nextNodes);
      setStoreEdges(nextEdges);
      addExpandedNodes(selectedNodeId, result.newNodes, result.newEdges);
    } catch (error) {
      console.error(error);
      alert(`Expansion failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = () => {
    addChildNode();
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
    loadFromLocal();
    alert("Project loaded");
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
