import { openai } from "@/lib/openai";
import { systemPrompt } from "@/lib/prompts/systemPrompt";
import { expandNodePrompt } from "@/lib/prompts/expandNodePrompt";
import { expandNodeSchema } from "@/lib/schemas/expandNodeSchema";
import { makeId } from "@/lib/utils/id";

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

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "developer",
          content: systemPrompt,
        },
        {
          role: "user",
          content: expandNodePrompt(selectedNode, nodes),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "expand_node_result",
          strict: true,
          schema: expandNodeSchema,
        },
      },
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "No structured content returned" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);
    const selectedPosition = selectedNode.position || { x: 250, y: 180 };

    const newNodes = parsed.newNodes.map((item, index) => ({
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

    const newEdges = newNodes.map((node) => ({
      id: makeId("edge"),
      source: nodeId,
      target: node.id,
    }));

    return Response.json({ newNodes, newEdges });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate AI nodes" },
      { status: 500 }
    );
  }
}
