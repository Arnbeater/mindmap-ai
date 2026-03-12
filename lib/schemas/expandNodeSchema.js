export const expandNodeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newNodes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          body: { type: "string" },
        },
        required: ["label", "body"],
      },
    },
  },
  required: ["newNodes"],
};
