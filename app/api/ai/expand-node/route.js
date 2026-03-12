export async function POST(request) {
  try {
    const body = await request.json();
    const { nodeId, nodes } = body;

    if (!nodeId || !nodes?.length) {
      return Response.json({ error: "Missing node data" }, { status: 400 });
    }

    const selectedNode = nodes.find((node) => node.id === nodeId);

    if (!selectedNode) {
      return Response.json(
        { error: "Selected node not found" },
        { status: 404 }
      );
    }

    const selectedPosition = selectedNode.position || { x: 250, y: 180 };

    const newNodes = [
      {
        id: `node_${Math.random().toString(36).slice(2, 10)}`,
        position: {
          x: selectedPosition.x + 280,
          y: selectedPosition.y,
        },
        data: {
          label: "New branch",
          body: "Dummy branch created without OpenAI",
        },
        type: "default",
      },
      {
        id: `node_${Math.random().toString(36).slice(2, 10)}`,
        position: {
          x: selectedPosition.x + 280,
          y: selectedPosition.y + 120,
        },
        data: {
          label: "Another branch",
          body: "This lets you continue building the UI",
        },
        type: "default",
      },
    ];

    const newEdges = newNodes.map((node) => ({
      id: `edge_${Math.random().toString(36).slice(2, 10)}`,
      source: nodeId,
      target: node.id,
    }));

    return Response.json({ newNodes, newEdges });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Dummy route failed" },
      { status: 500 }
    );
  }
}
