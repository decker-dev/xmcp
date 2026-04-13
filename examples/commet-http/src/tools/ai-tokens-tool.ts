import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { track } from "@xmcp-dev/commet";

export const schema = {
  prompt: z.string().describe("The prompt to send to the AI model"),
};

export const metadata: ToolMetadata = {
  name: "ai_chat",
  description: "Chat with AI, tracks token consumption per model",
};

export default async function aiChat({
  prompt,
}: InferSchema<typeof schema>) {
  const result = await track({
    feature: "ai_chat",
    model: "anthropic/claude-haiku-4.5",
    inputTokens: prompt.split(" ").length * 2,
    outputTokens: 6,
  });

  if (!result.allowed) {
    return result.message;
  }

  return `Response to: "${prompt}"`;
}
