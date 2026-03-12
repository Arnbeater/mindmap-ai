import { create } from "zustand";

const initialNodes = [
  {
    id: "root",
    position: { x: 250, y: 180 },
    data: {
      label: "Central idea",
      body: "Start your concept here",
    },
    type: "default",
  },
];

const initialEdges = [];

export const useMindmapStore = create((set) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: "root",

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),

  addExpandedNodes: (sourceId, newNodes, newEdges) =>
    set((state) => ({
      nodes: [...state.nodes, ...newNodes],
      edges: [...state.edges, ...newEdges],
      selectedNodeId: sourceId,
    })),
}));
