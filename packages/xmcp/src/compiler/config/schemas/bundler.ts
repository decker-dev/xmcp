import z from "zod";
import type { RspackOptions } from "@rspack/core";

// ------------------------------------------------------------
// Bundler config schema - currently supports Rspack
// ------------------------------------------------------------
export const bundlerConfigSchema = z
  .custom<(config: RspackOptions) => RspackOptions>()
  .optional();

export type BundlerConfig = z.infer<typeof bundlerConfigSchema>;
