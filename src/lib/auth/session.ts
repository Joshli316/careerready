import { cookies } from "next/headers";
import type { Lucia } from "lucia";

export async function getSessionUser(lucia: Lucia) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;

  const { session, user } = await lucia.validateSession(sessionId);
  if (!session) {
    // Clear the stale session cookie to avoid repeated DB lookups
    const blankCookie = lucia.createBlankSessionCookie();
    cookieStore.set(blankCookie.name, blankCookie.value, blankCookie.attributes);
    return null;
  }

  if (session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }

  return user;
}
