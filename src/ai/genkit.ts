import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {nextjs} from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    googleAI(),
    nextjs({
      // These are server-only.
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
