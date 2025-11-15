'use server';
/**
 * @fileOverview A health chatbot AI agent that can answer questions about a user's health data.
 *
 * - getChatbotResponse - A function that handles the chatbot interaction.
 * - ChatbotInput - The input type for the getChatbotResponse function.
 * - ChatbotOutput - The return type for the getChatbotResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeServerApp } from '@/firebase/server';

const ChatbotInputSchema = z.object({
  question: z.string().describe('The question the user is asking.'),
  userId: z.string().describe('The ID of the user asking the question.'),
    history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        text: z.string(),
    })).describe('The chat history between the user and the assistant.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.string().describe('The answer to the question.');
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return aiHealthChatbotFlow(input);
}

// Initialize Firebase Admin SDK
const { firestore } = initializeServerApp();

const getUserHealthData = ai.defineTool(
    {
        name: 'getUserHealthData',
        description: 'Returns the health data for a given user ID. Use this to answer questions about the user\'s health.',
        inputSchema: z.object({
            userId: z.string(),
        }),
        outputSchema: z.any(),
    },
    async (input) => {
        console.log(`[getUserHealthData] Getting health data for user ${input.userId}`);
        const healthStatsSnap = await firestore.collection(`users/${input.userId}/health_stats`).orderBy('timestamp', 'desc').limit(15).get();
        const healthStats = healthStatsSnap.docs.map(doc => ({id: doc.id, ...doc.data()}));
        
        const appointmentsSnap = await firestore.collection('appointments').where('patientId', '==', input.userId).get();
        const appointments = appointmentsSnap.docs.map(doc => ({id: doc.id, ...doc.data()}));
        
        return {
            healthStats,
            appointments,
        };
    }
)

const prompt = ai.definePrompt({
  name: 'aiHealthChatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  model: 'googleai/gemini-2.5-flash',
  tools: [getUserHealthData],
  prompt: `You are a helpful AI assistant for pregnant mothers. Your name is VitalSync Assistant.
    If the user asks a question about their health, use the getUserHealthData tool to get their latest health data and appointments.
    Answer the user's question based on the data provided by the tool.
    Be friendly, empathetic, and provide clear, concise information.
    If the data indicates a potential health risk, advise the user to contact their doctor.
    Do not provide medical advice that is not supported by the data.
    Keep your answers short and to the point.
    
    Chat History:
    {{#each history}}
        {{#if (eq role 'user')}}
        User: {{text}}
        {{else}}
        Assistant: {{text}}
        {{/if}}
    {{/each}}
    
    New question from user: {{{question}}}
  `,
});

const aiHealthChatbotFlow = ai.defineFlow(
  {
    name: 'aiHealthChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
