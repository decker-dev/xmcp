import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { track } from "@xmcp-dev/commet";

export const schema = {
  prompt: z.string().describe("The prompt to generate content from"),
};

export const metadata: ToolMetadata = {
  name: "ai-generate",
  description: "Generate content with AI, metered feature that tracks units per call",
};

export default async function aiGenerate({
  prompt,
}: InferSchema<typeof schema>) {
  const result = await track({
    feature: "ai-generate",
    units: 1,
  });

  if (!result.allowed) {
    return result.message;
  }

  return `Generated content for: "${prompt}" (plan: ${result.plan}, remaining: ${result.remaining ?? "unlimited"})`;
}
