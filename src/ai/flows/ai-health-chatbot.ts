'use server';

/**
 * @fileOverview This file defines the AI Health Chatbot flow, which allows pregnant mothers to ask questions and receive personalized advice.
 *
 * @exports aiHealthChatbot - The main function to interact with the chatbot.
 * @exports AiHealthChatbotInput - The input type for the aiHealthChatbot function.
 * @exports AiHealthChatbotOutput - The output type for the aiHealthChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


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
  prompt: `You are a helpful AI assistant for pregnant mothers. Your role is to provide personalized advice based on their questions and health data.

  Here is the user's question: {{{question}}}
  The User ID is: {{{userId}}}`,
});

const aiHealthChatbotFlow = ai.defineFlow(
  {
    name: 'aiHealthChatbotFlow',
    inputSchema: AiHealthChatbotInputSchema,
    outputSchema: AiHealthChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
