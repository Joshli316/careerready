export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

/**
 * Delete rate limit records older than 24 hours.
 * Call this periodically (e.g., at the start of rate limit checks) to
 * prevent the rate_limits table from growing unbounded.
 */
export async function cleanupExpiredRateLimits(db: D1Database): Promise<void> {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  try {
    await db
      .prepare("DELETE FROM rate_limits WHERE date < ?")
      .bind(yesterday)
      .run();
  } catch {
    // Non-critical — silently ignore cleanup failures
  }
}

const ANON_LIMIT = 5;
const AUTH_LIMIT = 20;

// In-memory fallback — used for local development and as a safety net when D1 is unreachable.
// WARNING: On Cloudflare Workers, this Map is per-isolate and resets on eviction.
// Using a stricter limit (half of normal) to compensate for the lack of cross-isolate sharing.
const FALLBACK_LIMIT_DIVISOR = 2;
const counts = new Map<string, { date: string; count: number }>();

export function checkRateLimit(
  key: string,
  isAuthenticated: boolean
): RateLimitResult {
  const limit = Math.ceil((isAuthenticated ? AUTH_LIMIT : ANON_LIMIT) / FALLBACK_LIMIT_DIVISOR);
  const today = new Date().toISOString().split("T")[0];

  const entry = counts.get(key);
  if (!entry || entry.date !== today) {
    counts.set(key, { date: today, count: 1 });
    return { allowed: true, remaining: limit - 1, limit };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, limit };
}

/**
 * D1-backed rate limiting for production. Uses the rateLimits table
 * to persist counts across worker restarts and deployments.
 */
export async function checkRateLimitD1(
  db: D1Database,
  key: string,
  isAuthenticated: boolean
): Promise<RateLimitResult> {
  const limit = isAuthenticated ? AUTH_LIMIT : ANON_LIMIT;
  const today = new Date().toISOString().split("T")[0];

  // Probabilistically clean up expired records (~1% of requests)
  if (Math.random() < 0.01) {
    await cleanupExpiredRateLimits(db);
  }

  try {
    // Atomic increment-then-check: avoids TOCTOU race between concurrent requests.
    // The INSERT...ON CONFLICT atomically creates or increments the counter.
    await db
      .prepare(
        "INSERT INTO rate_limits (key, date, requests) VALUES (?, ?, 1) ON CONFLICT(key, date) DO UPDATE SET requests = requests + 1"
      )
      .bind(key, today)
      .run();

    // Read the current count after the atomic increment
    const row = await db
      .prepare("SELECT requests FROM rate_limits WHERE key = ? AND date = ?")
      .bind(key, today)
      .first<{ requests: number }>();

    const current = row?.requests ?? 1;

    if (current > limit) {
      return { allowed: false, remaining: 0, limit };
    }

    return { allowed: true, remaining: limit - current, limit };
  } catch {
    // If D1 fails, fall back to in-memory to avoid blocking AI features
    return checkRateLimit(key, isAuthenticated);
  }
}
