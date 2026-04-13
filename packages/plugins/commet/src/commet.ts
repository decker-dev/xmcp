import type { Commet } from "@commet/node";
import { getCommetContext } from "./context.js";
import type { CheckResult, TrackResult, TrackOptions } from "./types.js";

export function getClient(): Commet {
  const { client } = getCommetContext();
  if (!client) {
    throw new Error(
      "[Commet] Client not initialized. " +
        "Ensure this is called within a request context with commetProvider configured."
    );
  }
  return client;
}

export function getCustomerId(): string {
  const { customerId } = getCommetContext();
  if (!customerId) {
    throw new Error(
      "[Commet] No customer ID found in request. " +
        "Ensure the request includes the customer header configured in commetProvider."
    );
  }
  return customerId;
}

export async function getPortalUrl(): Promise<string> {
  const client = getClient();
  const customerId = getCustomerId();
  const response = await client.customer(customerId).portal.getUrl();
  if (!response.success || !response.data) {
    throw new Error("[Commet] Failed to retrieve portal URL.");
  }
  return response.data.portalUrl;
}

export async function check(feature: string): Promise<CheckResult> {
  const client = getClient();
  const customerId = getCustomerId();
  const customer = client.customer(customerId);

  const [featureResponse, subscriptionResponse] = await Promise.all([
    customer.features.check(feature),
    customer.subscription.get(),
  ]);

  const planName = subscriptionResponse.data?.plan.name;

  if (!subscriptionResponse.data) {
    return {
      allowed: false,
      code: "no_subscription",
      message: "No active subscription found.",
    };
  }

  if (!featureResponse.success || !featureResponse.data?.allowed) {
    return {
      allowed: false,
      code: "feature_not_allowed",
      message: `Your ${planName} plan does not include this feature.`,
      plan: planName,
    };
  }

  return {
    allowed: true,
    code: "feature_enabled",
    message: "Feature is enabled.",
    plan: planName,
  };
}

export async function track(options: TrackOptions): Promise<TrackResult> {
  const client = getClient();
  const customerId = getCustomerId();
  const customer = client.customer(customerId);

  const [featureResponse, subscriptionResponse] = await Promise.all([
    customer.features.get(options.feature),
    customer.subscription.get(),
  ]);

  const planName = subscriptionResponse.data?.plan.name;

  if (!subscriptionResponse.data) {
    return {
      allowed: false,
      code: "no_subscription",
      message: "No active subscription found.",
    };
  }

  if (!featureResponse.success || !featureResponse.data) {
    throw new Error(
      `[Commet] Failed to check feature "${options.feature}".`
    );
  }

  const featureAccess = featureResponse.data;

  if (!featureAccess.allowed) {
    return {
      allowed: false,
      code: "feature_not_allowed",
      message: `Your ${planName} plan does not include ${featureAccess.name}.`,
      plan: planName,
    };
  }

  if ("model" in options && options.model) {
    await client.usage.track({
      feature: options.feature,
      customerId,
      model: options.model,
      inputTokens: options.inputTokens,
      outputTokens: options.outputTokens,
      cacheReadTokens: options.cacheReadTokens,
      cacheWriteTokens: options.cacheWriteTokens,
    });
  } else {
    await client.usage.track({
      feature: options.feature,
      customerId,
      value: options.units,
    });
  }

  return {
    allowed: true,
    code: "tracked",
    message: "Usage tracked.",
    plan: planName,
    remaining: featureAccess.remaining,
    included: featureAccess.included,
    overage: featureAccess.overage,
    unlimited: featureAccess.unlimited,
  };
}
