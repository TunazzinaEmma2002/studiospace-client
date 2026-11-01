// All calls go through /server/... (see next.config.mjs). The JWT lives in an HTTPOnly cookie.
const BASE = "/server";

let inFlight = null;

async function startServerSession() {
  const res = await fetch("/api/server-proof", { cache: "no-store" });
  if (!res.ok) throw new Error("Please log in first");
  const { proof } = await res.json();
  const jwtRes = await fetch(`${BASE}/jwt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proof }),
  });
  if (!jwtRes.ok) throw new Error("Could not start a secure session");
}

// Trade the BetterAuth login for the server's HTTPOnly JWT cookie (one request at a time)
export function syncServerSession() {
  if (!inFlight) {
    inFlight = startServerSession().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

export async function api(path, { method = "GET", body } = {}) {
  const run = () =>
    fetch(`${BASE}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

  let res = await run();
  if (res.status === 401) {
    // No cookie yet (or it expired): get a new one and try once more
    try {
      await syncServerSession();
      res = await run();
    } catch {
      /* fall through with the original 401 */
    }
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.message || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}