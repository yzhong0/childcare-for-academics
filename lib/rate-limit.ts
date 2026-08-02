// Minimal in-memory rate limiter, keyed by client IP. Sufficient for a
// single-process deployment; swap for a shared store if scaled out.
const hits = new Map<string, number[]>();

export function allow(ip: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}
