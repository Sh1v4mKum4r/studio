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

export async function submitHealthStat(values: unknown) {
  // In a real app, you would get user/doctor info from the session
  const dummyData = {
    userId: 'user123',
    userName: 'Jane Doe',
    doctorId: 'doc456',
    doctorName: 'Dr. Carter',
  };

  try {
    // Validate and coerce incoming values
    const parsed = healthStatSchema.parse(values);

    // debug: show parsed values in server logs
    console.log('submitHealthStat parsed values:', parsed);

    const result = await analyzeHealthStatsAndGenerateAlerts({
      systolic: parsed.systolic,
      diastolic: parsed.diastolic,
      sugarLevel: parsed.sugarLevel,
      weight: parsed.weight,
      heartRate: parsed.heartRate,
      timestamp: new Date().toISOString(),
      ...dummyData,
    });
    
    // In a real app, you would save the new health stat and the alert to Firestore here.
    
    return { success: true, alert: result };
  } catch (error) {
    console.error('Error analyzing health stats:', error);
    return { success: false, error: (error as Error)?.message ?? String(error) };
  }
}

export async function getChatbotResponse(userId: string, question: string) {
    const trimmed = question?.trim();
    if (!trimmed) {
        return { answer: "Please provide a question." };
    }

    if (!userId || !userId.trim()) {
        return { answer: "Invalid user ID." };
    }
    
    try {
        const response = await aiHealthChatbot({ userId: userId.trim(), question: trimmed });
        return response;
    } catch (error) {
        console.error('Error getting chatbot response:', error);
        return { answer: "I'm sorry, I encountered an error. Please try again later." };
    }
}
