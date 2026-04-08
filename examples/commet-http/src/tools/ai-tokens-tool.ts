import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { check, track } from "@xmcp-dev/commet";

export const schema = {
  prompt: z.string().describe("The prompt to send to the AI model"),
};

export const metadata: ToolMetadata = {
  name: "ai-chat",
  description: "Chat with AI, tracks tokens per model",
};

export default async function aiChat({
  prompt,
}: InferSchema<typeof schema>) {
  const preCheck = await check("ai-chat");
  if (!preCheck.allowed) {
    return preCheck.message;
  }

  const aiResponse = `Response to: "${prompt}"`;
  const inputTokens = prompt.split(" ").length * 2;
  const outputTokens = aiResponse.split(" ").length * 2;

  const trackResult = await track({
    feature: "ai-chat",
    model: "claude-sonnet-4-20250514",
    inputTokens,
    outputTokens,
  });

  if (!trackResult.allowed) {
    return trackResult.message;
  }

  return aiResponse;
}
