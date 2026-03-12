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

function makeId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useMindmapStore = create((set, get) => ({
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

  addChildNode: () => {
    const { nodes, edges, selectedNodeId } = get();
    const parentNode = nodes.find((node) => node.id === selectedNodeId);

    if (!parentNode) return;

    const childId = makeId("node");
    const siblingCount = edges.filter((edge) => edge.source === parentNode.id).length;

    const newNode = {
      id: childId,
      position: {
        x: parentNode.position.x + 280,
        y: parentNode.position.y + siblingCount * 120,
      },
      data: {
        label: "New node",
        body: "Edit this idea",
      },
      type: "default",
    };

    const newEdge = {
      id: makeId("edge"),
      source: parentNode.id,
      target: childId,
    };

    set({
      nodes: [...nodes, newNode],
      edges: [...edges, newEdge],
      selectedNodeId: childId,
    });
  },

  deleteSelectedNode: () => {
    const { nodes, edges, selectedNodeId } = get();

    if (!selectedNodeId || selectedNodeId === "root") return;

    const nextNodes = nodes.filter((node) => node.id !== selectedNodeId);
    const nextEdges = edges.filter(
      (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
    );

    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedNodeId: "root",
    });
  },

  resetMap: () =>
    set({
      nodes: initialNodes,
      edges: initialEdges,
      selectedNodeId: "root",
    }),

  saveToLocal: () => {
    const { nodes, edges, selectedNodeId } = get();

    localStorage.setItem(
      "mindmap-ai-project",
      JSON.stringify({
        nodes,
        edges,
        selectedNodeId,
      })
    );
  },

  loadFromLocal: () => {
    const raw = localStorage.getItem("mindmap-ai-project");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);

      set({
        nodes: parsed.nodes || initialNodes,
        edges: parsed.edges || initialEdges,
        selectedNodeId: parsed.selectedNodeId || "root",
      });
    } catch (error) {
      console.error("Failed to load project from localStorage", error);
    }
  },
}));
