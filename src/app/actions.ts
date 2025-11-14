'use server';

import { aiHealthChatbot } from '@/ai/flows/ai-health-chatbot';
import { analyzeHealthStatsAndGenerateAlerts } from '@/ai/flows/automated-health-alerts';
import { z } from 'zod';

const healthStatSchema = z.object({
  systolic: z.coerce.number().min(50).max(300),
  diastolic: z.coerce.number().min(30).max(200),
  sugarLevel: z.coerce.number().min(30).max(500),
  weight: z.coerce.number().min(20).max(300),
  heartRate: z.coerce.number().min(30).max(250),
});

export async function submitHealthStat(values: z.infer<typeof healthStatSchema>) {
  // In a real app, you would get user/doctor info from the session
  const dummyData = {
    userId: 'user123',
    userName: 'Jane Doe',
    doctorId: 'doc456',
    doctorName: 'Dr. Carter',
  };

  try {
    const result = await analyzeHealthStatsAndGenerateAlerts({
      bloodPressure: values.systolic, // Assuming systolic is the main value for analysis
      sugarLevel: values.sugarLevel,
      timestamp: new Date().toISOString(),
      ...dummyData,
    });
    
    // In a real app, you would save the new health stat and the alert to Firestore here.
    
    return { success: true, alert: result };
  } catch (error) {
    console.error('Error analyzing health stats:', error);
    return { success: false, error: 'Failed to analyze health stats.' };
  }
}

export async function getChatbotResponse(userId: string, question: string) {
    if(!question) {
        return { answer: "Please provide a question." };
    }
    
    try {
        const response = await aiHealthChatbot({ userId, question });
        return response;
    } catch (error) {
        console.error('Error getting chatbot response:', error);
        return { answer: "I'm sorry, I encountered an error. Please try again later." };
    }
}
