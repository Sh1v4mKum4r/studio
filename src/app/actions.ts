
'use server';

import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { aiHealthChatbot } from '@/ai/flows/ai-health-chatbot';
import { analyzeHealthStatsAndGenerateAlerts } from '@/ai/flows/automated-health-alerts';
import { initializeServerApp } from '@/firebase/server';

// Schemas
const healthStatSchema = z.object({
  systolic: z.coerce.number().min(50).max(300),
  diastolic: z.coerce.number().min(30).max(200),
  sugarLevel: z.coerce.number().min(30).max(500),
  weight: z.coerce.number().min(20).max(300),
  heartRate: z.coerce.number().min(30).max(250),
  userId: z.string().min(1),
});

const appointmentSchema = z.object({
  patientName: z.string().min(1),
  doctorId: z.string().min(1),
  reason: z.string().max(1000).optional(),
});

const reminderSchema = z.object({
  title: z.string().min(1).max(200),
  datetime: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: 'datetime must be a valid ISO date string',
  }),
  note: z.string().max(1000).optional(),
  userId: z.string().min(1).optional(),
});

// Actions

export async function submitHealthStat(values: unknown) {
  console.log('[submitHealthStat] incoming for AI analysis:', values);
  try {
    const parsed = healthStatSchema.parse(values);
    
    // The database write is handled on the client.
    // This server action is only for AI analysis.

    const result = await analyzeHealthStatsAndGenerateAlerts({
      systolic: parsed.systolic,
      diastolic: parsed.diastolic,
      sugarLevel: parsed.sugarLevel,
      timestamp: new Date().toISOString(),
      // Replace with real session/user data where appropriate
      userId: parsed.userId,
      userName: 'Jane Doe',
      doctorId: 'doc456',
      doctorName: 'Dr. Carter',
    });

    console.log('[submitHealthStat] analyzer result:', result);
    return { success: true, alert: result };
  } catch (err) {
    console.error('[submitHealthStat] error:', err);
    if (err instanceof z.ZodError) {
      return { success: false, errorType: 'validation', issues: err.errors, message: err.message };
    }
    return { success: false, errorType: 'internal', message: (err as Error)?.message ?? String(err) };
  }
}

export async function getChatbotResponse(userId: string, question: string) {
  console.log('[getChatbotResponse] userId:', userId, 'question:', question);
  const trimmed = question?.trim();
  if (!trimmed) return { success: false, errorType: 'validation', message: 'Empty question' };
  if (!userId || !userId.trim()) return { success: false, errorType: 'validation', message: 'Invalid userId' };

  try {
    const response = await aiHealthChatbot({ userId: userId.trim(), question: trimmed });
    console.log('[getChatbotResponse] response:', response);
    return { success: true, ...response };
  } catch (err) {
    console.error('[getChatbotResponse] error:', err);
    return { success: false, errorType: 'internal', message: (err as Error)?.message ?? String(err) };
  }
}

export async function submitAppointment(values: unknown) {
  console.log('[submitAppointment] incoming for server-side processing:', values);
  try {
    const parsed = appointmentSchema.parse(values);
    // DB write is handled client-side.
    // This action can be used for notifications, etc.
    console.log('[submitAppointment] parsed for server action:', parsed);
    return { success: true };
  } catch (err) {
    console.error('[submitAppointment] error:', err);
    if (err instanceof z.ZodError) return { success: false, errorType: 'validation', issues: err.errors };
    return { success: false, errorType: 'internal', message: (err as Error)?.message ?? String(err) };
  }
}

export async function submitSOS(values: unknown) {
  console.log('[submitSOS] incoming for server-side processing:', values);
  try {
    const schema = z.object({
      userId: z.string().min(1),
      lat: z.coerce.number().gte(-90).lte(90),
      lng: z.coerce.number().gte(-180).lte(180),
      note: z.string().max(1000).optional(),
    });
    const parsed = schema.parse(values);
    // DB write is handled client-side.
    // This action can be used for notifications, etc.
    console.log('[submitSOS] parsed for server action:', parsed);
    // TODO: notify emergency contacts
    return { success: true };
  } catch (err)_ {
    console.error('[submitSOS] error:', err);
    if (err instanceof z.ZodError) return { success: false, errorType: 'validation', issues: err.errors };
    return { success: false, errorType: 'internal', message: (err as Error)?.message ?? String(err) };
  }
}

export async function submitReminder(values: unknown) {
  console.log('[submitReminder] incoming for server-side processing:', values);
  try {
    // This schema is simplified as we are not using all fields from the client
    const parsed = z.object({ title: z.string() }).parse(values);
     // DB write is handled client-side.
    // This action can be used for queuing push notifications, etc.
    console.log('[submitReminder] parsed for server action:', parsed);
    return { success: true };
  } catch (err) {
    console.error('[submitReminder] error:', err);
    if (err instanceof z.ZodError) return { success: false, errorType: 'validation', issues: err.errors };
    return { success: false, errorType: 'internal', message: (err as Error)?.message ?? String(err) };
  }
}
