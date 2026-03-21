export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

const ANON_LIMIT = 5;
const AUTH_LIMIT = 20;

// In-memory fallback for local development (resets on restart).
// Production uses D1 via checkRateLimitD1 below.
const counts = new Map<string, { date: string; count: number }>();

export function checkRateLimit(
  key: string,
  isAuthenticated: boolean
): RateLimitResult {
  const limit = isAuthenticated ? AUTH_LIMIT : ANON_LIMIT;
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

  try {
    const row = await db
      .prepare("SELECT requests FROM rate_limits WHERE key = ? AND date = ?")
      .bind(key, today)
      .first<{ requests: number }>();

    if (!row) {
      await db
        .prepare(
          "INSERT INTO rate_limits (key, date, requests) VALUES (?, ?, 1) ON CONFLICT(key, date) DO UPDATE SET requests = requests + 1"
        )
        .bind(key, today)
        .run();
      return { allowed: true, remaining: limit - 1, limit };
    }

    if (row.requests >= limit) {
      return { allowed: false, remaining: 0, limit };
    }

    await db
      .prepare("UPDATE rate_limits SET requests = requests + 1 WHERE key = ? AND date = ?")
      .bind(key, today)
      .run();

    return { allowed: true, remaining: limit - (row.requests + 1), limit };
  } catch {
    // If D1 fails, fall back to in-memory to avoid blocking AI features
    return checkRateLimit(key, isAuthenticated);
  }
}
