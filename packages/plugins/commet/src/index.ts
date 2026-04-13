export { commetProvider } from "./provider.js";

export {
  getClient,
  getCustomerId,
  getPortalUrl,
  check,
  track,
} from "./commet.js";

export type { Commet } from "@commet/node";

export type {
  CommetProviderConfig,
  CheckResult,
  CheckCode,
  TrackResult,
  TrackCode,
  TrackOptions,
} from "./types.js";
