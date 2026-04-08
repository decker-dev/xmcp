export interface CommetProviderConfig {
  apiKey: string;
  environment?: "production" | "sandbox";
  customerHeader?: string;
}

export type CheckCode =
  | "feature_enabled"
  | "feature_not_allowed"
  | "no_subscription";

export interface CheckResult {
  allowed: boolean;
  code: CheckCode;
  message: string;
  plan?: string;
}

export type TrackCode =
  | "tracked"
  | "feature_not_allowed"
  | "no_subscription";

export interface TrackResult {
  allowed: boolean;
  code: TrackCode;
  message: string;
  plan?: string;
  remaining?: number;
  included?: number;
  overage?: number;
  unlimited?: boolean;
}

interface TrackUsageOptions {
  feature: string;
  units: number;
  model?: never;
  inputTokens?: never;
  outputTokens?: never;
  cacheReadTokens?: never;
  cacheWriteTokens?: never;
}

interface TrackTokensOptions {
  feature: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  units?: never;
}

export type TrackOptions = TrackUsageOptions | TrackTokensOptions;
