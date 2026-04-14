/**
 * Retries a promise-returning function with exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  baseDelayMs = 500
): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      attempt++;
      await new Promise(resolve => setTimeout(resolve, baseDelayMs * Math.pow(2, attempt - 1)));
    }
  }
  throw new Error("Unreachable");
}
