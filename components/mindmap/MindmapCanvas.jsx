"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { useMindmapStore } from "@/store/useMindmapStore";
import NodeToolbar from "./NodeToolbar";

function CustomNode({ data }) {
  return (
    <div className="custom-node">
      <strong>{data.label}</strong>
      <p>{data.body}</p>
    </div>
  );
}

const nodeTypes = {
  default: CustomNode,
};

export default function MindmapCanvas() {
  const storeNodes = useMindmapStore((state) => state.nodes);
  const storeEdges = useMindmapStore((state) => state.edges);
  const selectedNodeId = useMindmapStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useMindmapStore((state) => state.setSelectedNodeId);
  const addExpandedNodes = useMindmapStore((state) => state.addExpandedNodes);
  const setStoreNodes = useMindmapStore((state) => state.setNodes);
  const setStoreEdges = useMindmapStore((state) => state.setEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);
  const [loading, setLoading] = useState(false);

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
      alert("AI expansion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reactflow-wrapper">
      <NodeToolbar
        onExpand={handleExpand}
        disabled={loading}
        selectedNodeId={selectedNodeId}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
