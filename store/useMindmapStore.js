import { create } from "zustand";

const STORAGE_KEYS = {
  legacyProject: "mindmap-ai-project",
  projects: "mindmap-ai-projects",
  activeProjectId: "mindmap-ai-active-project-id",
};

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

function createNewProject(name = "Untitled map") {
  const now = new Date().toISOString();

  return {
    id: makeId("map"),
    name,
    nodes: initialNodes,
    edges: initialEdges,
    selectedNodeId: "root",
    createdAt: now,
    updatedAt: now,
  };
}

function getStorageProjects() {
  const raw = localStorage.getItem(STORAGE_KEYS.projects);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((project) => project && project.id);
  } catch (error) {
    console.error("Failed to parse saved maps", error);
    return [];
  }
}

function persistProjects(projects) {
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
}

function removeNodeFromState(state, nodeId) {
  if (!nodeId || nodeId === "root") return state;

  const nextNodes = state.nodes.filter((node) => node.id !== nodeId);
  const nextEdges = state.edges.filter(
    (edge) => edge.source !== nodeId && edge.target !== nodeId
  );

  return {
    ...state,
    nodes: nextNodes,
    edges: nextEdges,
    selectedNodeId: state.selectedNodeId === nodeId ? "root" : state.selectedNodeId,
  };
}

function toProjectSummary(project) {
  return {
    id: project.id,
    name: project.name,
    updatedAt: project.updatedAt,
  };
}

export const useMindmapStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: "root",
  activeProjectId: null,
  savedMaps: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),

  updateNodeById: (nodeId, { label, body }) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                label,
                body,
              },
            }
          : node
      ),
    })),

  updateSelectedNode: ({ label, body }) => {
    const { nodes, selectedNodeId } = get();

    const nextNodes = nodes.map((node) => {
      if (node.id !== selectedNodeId) return node;

      return {
        ...node,
        data: {
          ...node.data,
          label,
          body,
        },
      };
    });

    set({ nodes: nextNodes });
  },

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

    return childId;
  },

  deleteNodeById: (nodeId) =>
    set((state) => removeNodeFromState(state, nodeId)),

  deleteSelectedNode: () =>
    set((state) => removeNodeFromState(state, state.selectedNodeId)),

  resetMap: () =>
    set({
      nodes: initialNodes,
      edges: initialEdges,
      selectedNodeId: "root",
    }),

  saveToLocal: (nameOverride) => {
    const { nodes, edges, selectedNodeId, activeProjectId } = get();
    const now = new Date().toISOString();
    const nextName = nameOverride?.trim();
    const projects = getStorageProjects();

    let projectId = activeProjectId;
    if (!projectId) {
      const freshProject = createNewProject(nextName || "Untitled map");
      projectId = freshProject.id;
    }

    const existingProject = projects.find((project) => project.id === projectId);
    const nextProject = {
      id: projectId,
      name: nextName || existingProject?.name || "Untitled map",
      nodes,
      edges,
      selectedNodeId,
      createdAt: existingProject?.createdAt || now,
      updatedAt: now,
    };

    const nextProjects = existingProject
      ? projects.map((project) => (project.id === projectId ? nextProject : project))
      : [nextProject, ...projects];

    persistProjects(nextProjects);
    localStorage.setItem(STORAGE_KEYS.activeProjectId, projectId);

    set({
      activeProjectId: projectId,
      savedMaps: nextProjects.map(toProjectSummary),
    });

    return nextProject;
  },

  loadFromLocal: (projectIdOverride) => {
    let projects = getStorageProjects();

    if (!projects.length) {
      const legacyRaw = localStorage.getItem(STORAGE_KEYS.legacyProject);

      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          const migratedProject = {
            ...createNewProject("My first map"),
            nodes: parsedLegacy.nodes || initialNodes,
            edges: parsedLegacy.edges || initialEdges,
            selectedNodeId: parsedLegacy.selectedNodeId || "root",
          };

          projects = [migratedProject];
          persistProjects(projects);
          localStorage.removeItem(STORAGE_KEYS.legacyProject);
        } catch (error) {
          console.error("Failed to migrate legacy project", error);
        }
      }
    }

    if (!projects.length) {
      const starterProject = createNewProject("My first map");
      projects = [starterProject];
      persistProjects(projects);
    }

    const storedActiveId = localStorage.getItem(STORAGE_KEYS.activeProjectId);
    const targetId = projectIdOverride || storedActiveId;
    const activeProject =
      projects.find((project) => project.id === targetId) || projects[0];

    if (!activeProject) return;

    localStorage.setItem(STORAGE_KEYS.activeProjectId, activeProject.id);

    set({
      nodes: activeProject.nodes || initialNodes,
      edges: activeProject.edges || initialEdges,
      selectedNodeId: activeProject.selectedNodeId || "root",
      activeProjectId: activeProject.id,
      savedMaps: projects.map(toProjectSummary),
    });

    return activeProject;
  },

  createProject: (name = "Untitled map") => {
    const newProject = createNewProject(name.trim() || "Untitled map");
    const projects = [newProject, ...getStorageProjects()];

    persistProjects(projects);
    localStorage.setItem(STORAGE_KEYS.activeProjectId, newProject.id);

    set({
      nodes: newProject.nodes,
      edges: newProject.edges,
      selectedNodeId: newProject.selectedNodeId,
      activeProjectId: newProject.id,
      savedMaps: projects.map(toProjectSummary),
    });

    return newProject;
  },

  deleteProject: (projectId) => {
    const projects = getStorageProjects();
    const nextProjects = projects.filter((project) => project.id !== projectId);

    if (!nextProjects.length) {
      const starterProject = createNewProject("My first map");
      nextProjects.push(starterProject);
    }

    persistProjects(nextProjects);

    const { activeProjectId } = get();
    const nextActiveProject =
      nextProjects.find((project) => project.id === activeProjectId) || nextProjects[0];

    localStorage.setItem(STORAGE_KEYS.activeProjectId, nextActiveProject.id);

    set({
      nodes: nextActiveProject.nodes || initialNodes,
      edges: nextActiveProject.edges || initialEdges,
      selectedNodeId: nextActiveProject.selectedNodeId || "root",
      activeProjectId: nextActiveProject.id,
      savedMaps: nextProjects.map(toProjectSummary),
    });

    return nextActiveProject;
  },
}));
