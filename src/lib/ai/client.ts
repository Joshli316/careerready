import Anthropic from "@anthropic-ai/sdk";

export const AI_MODEL = "claude-sonnet-4-20250514";

let cachedClient: Anthropic | null = null;
let cachedKey: string | null = null;

export function getAIClient(apiKey: string): Anthropic {
  // Recreate client if the API key has changed (e.g., key rotation)
  if (!cachedClient || cachedKey !== apiKey) {
    cachedClient = new Anthropic({ apiKey });
    cachedKey = apiKey;
  }
  return cachedClient;
}
