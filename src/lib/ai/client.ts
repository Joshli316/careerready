import Anthropic from "@anthropic-ai/sdk";

export const AI_MODEL = "claude-sonnet-4-20250514";

let cachedClient: Anthropic | null = null;
let cachedKey: string | null = null;
let cachedAt = 0;

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — re-create client periodically to pick up key rotations

export function getAIClient(apiKey: string): Anthropic {
  const now = Date.now();
  // Recreate client if the API key has changed or cache has expired
  if (!cachedClient || cachedKey !== apiKey || now - cachedAt > CACHE_TTL_MS) {
    cachedClient = new Anthropic({ apiKey });
    cachedKey = apiKey;
    cachedAt = now;
  }
  return cachedClient;
}
