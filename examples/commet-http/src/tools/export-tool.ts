import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { check } from "@xmcp-dev/commet";

export const schema = {
  format: z.enum(["csv", "json", "pdf"]).describe("Export format"),
};

export const metadata: ToolMetadata = {
  name: "export",
  description: "Export data in multiple formats, Pro plan only",
};

export default async function exportData({
  format,
}: InferSchema<typeof schema>) {
  const result = await check("export");

  if (!result.allowed) {
    return result.message;
  }

  return `Exported data as ${format} (plan: ${result.plan})`;
}
