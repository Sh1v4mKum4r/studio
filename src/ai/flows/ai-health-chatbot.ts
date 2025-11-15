
'use server';

/**
 * @fileOverview This file defines the AI Health Chatbot flow, which allows pregnant mothers to ask questions and receive personalized advice.
 *
 * @exports aiHealthChatbot - The main function to interact with the chatbot.
 * @exports AiHealthChatbotInput - The input type for the aiHealthChatbot function.
 * @exports AiHealthChatbotOutput - The output type for the aiHealthChatbot function.
 */

import {ai} from '@/ai/genkit';
import {mockHealthStats} from '@/lib/data';
import {z} from 'genkit';

const HealthStatSchema = z.object({
  statId: z.string(),
  userId: z.string(),
  timestamp: z.string(),
  bloodPressure: z.object({
    systolic: z.number(),
    diastolic: z.number(),
  }),
  sugarLevel: z.number(),
  weight: z.number(),
  heartRate: z.number(),
  alertLevel: z.enum(['critical', 'warning', 'normal']).optional(),
});

const getHealthDataTool = ai.defineTool(
  {
    name: 'getUserHealthData',
    description: "Get the user's latest health data, such as blood pressure, sugar level, weight, and heart rate.",
    inputSchema: z.object({userId: z.string()}),
    outputSchema: HealthStatSchema.optional(),
  },
  async ({userId}) => {
    // In a real app, you would fetch this from your database.
    // For now, we'll use mock data.
    const userStats = mockHealthStats
      .filter(stat => stat.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    return userStats[0];
  }
);


const AiHealthChatbotInputSchema = z.object({
  userId: z.string().describe('The ID of the user asking the question.'),
  question: z.string().describe('The question the user is asking.'),
});
export type AiHealthChatbotInput = z.infer<typeof AiHealthChatbotInputSchema>;

const AiHealthChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot answer to the user question.'),
});
export type AiHealthChatbotOutput = z.infer<typeof AiHealthChatbotOutputSchema>;

export async function aiHealthChatbot(input: AiHealthChatbotInput): Promise<AiHealthChatbotOutput> {
  return aiHealthChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHealthChatbotPrompt',
  input: {schema: AiHealthChatbotInputSchema},
  output: {schema: AiHealthChatbotOutputSchema},
  tools: [getHealthDataTool],
  system: `You are a helpful AI assistant for pregnant mothers. Your role is to provide personalized advice based on their questions and health data.

If the user asks a question about their health data (e.g., blood pressure, weight, sugar levels), use the getUserHealthData tool to retrieve their latest measurements before answering.

When providing advice, be empathetic, clear, and encouraging. Always recommend that the user consults with their healthcare provider for any serious concerns.`,
  prompt: `Here is the user's question: {{{question}}}
The User ID is: {{{userId}}}`,
  model: 'googleai/gemini-2.5-flash',
});

const aiHealthChatbotFlow = ai.defineFlow(
  {
    name: 'aiHealthChatbotFlow',
    inputSchema: AiHealthChatbotInputSchema,
    outputSchema: AiHealthChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a response.");
    }
    return output;
  }
);
