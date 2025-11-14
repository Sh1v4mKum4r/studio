import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {genkitx} from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    googleAI(),
    genkitx({
      // These are server-only.
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
