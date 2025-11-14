/**
 * @fileoverview This file is executed once when the server starts.
 * It is used to register any instrumentation hooks, such as Genkit's.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import the AI dev server and start it.
    await import('./ai/dev');
  }
}
