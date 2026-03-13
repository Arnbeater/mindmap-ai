import { getDefaultModel, getOpenAI } from "@/lib/openai";
import { expandNodePrompt } from "@/lib/prompts/expandNodePrompt";
import { systemPrompt } from "@/lib/prompts/systemPrompt";
import { makeId } from "@/lib/utils/id";
import { expandNodeSchema } from "@/lib/schemas/expandNodeSchema";

function buildFallbackNodes(selectedPosition, nodeId) {
  const newNodes = [
    {
      id: makeId("node"),
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
      id: makeId("node"),
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
    id: makeId("edge"),
    source: nodeId,
    target: node.id,
  }));

  return { newNodes, newEdges };
}

function normalizeAiNodes(rawNodes, selectedPosition) {
  const validNodes = Array.isArray(rawNodes)
    ? rawNodes
        .map((item) => ({
          label: typeof item?.label === "string" ? item.label.trim() : "",
          body: typeof item?.body === "string" ? item.body.trim() : "",
        }))
        .filter((item) => item.label)
    : [];

  return validNodes.slice(0, 6).map((item, index) => ({
    id: makeId("node"),
    position: {
      x: selectedPosition.x + 280,
      y: selectedPosition.y + index * 120,
    },
    data: {
      label: item.label,
      body: item.body,
    },
    type: "default",
  }));
}

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

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(buildFallbackNodes(selectedPosition, nodeId));
    }

    const client = getOpenAI();
    const completion = await client.responses.create({
      model: getDefaultModel(),
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: expandNodePrompt(selectedNode, nodes),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "expand_node",
          schema: expandNodeSchema,
          strict: true,
        },
      },
    });

    const parsed = JSON.parse(completion.output_text || "{}");
    const newNodes = normalizeAiNodes(parsed.newNodes, selectedPosition);

    if (!newNodes.length) {
      return Response.json(
        { error: "AI did not return valid branches" },
        { status: 502 }
      );
    }

    const newEdges = newNodes.map((node) => ({
      id: makeId("edge"),
      source: nodeId,
      target: node.id,
    }));

    return Response.json({ newNodes, newEdges });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Expand route failed" },
      { status: 500 }
    );
  }
}
