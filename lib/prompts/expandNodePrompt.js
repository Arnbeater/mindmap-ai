export function expandNodePrompt(node, allNodes) {
  return `
Expand this mindmap node into 4 useful child branches.

Selected node:
- Label: ${node?.data?.label || ""}
- Body: ${node?.data?.body || ""}

Context nodes:
${allNodes
  .map((n) => `- ${n.data?.label || ""}: ${n.data?.body || ""}`)
  .join("\n")}

Return JSON only.
`;
}
