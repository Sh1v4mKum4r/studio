'use server';

import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { aiHealthChatbot } from '@/ai/flows/ai-health-chatbot';
import { analyzeHealthStatsAndGenerateAlerts } from '@/ai/flows/automated-health-alerts';

// Schemas
const healthStatSchema = z.object({
  systolic: z.coerce.number().min(50).max(300),
  diastolic: z.coerce.number().min(30).max(200),
  sugarLevel: z.coerce.number().min(30).max(500),
  weight: z.coerce.number().min(20).max(300),
  heartRate: z.coerce.number().min(30).max(250),
});

const appointmentSchema = z.object({
  patientName: z.string().min(1),
  doctorId: z.string().min(1),
  // ISO datetime string
  datetime: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: 'datetime must be a valid ISO date string',
  }),
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
  console.log('[submitHealthStat] incoming:', values);
  try {
    const parsed = healthStatSchema.parse(values);
    console.log('[submitHealthStat] parsed:', parsed);

    const result = await analyzeHealthStatsAndGenerateAlerts({
      systolic: parsed.systolic,
      diastolic: parsed.diastolic,
      sugarLevel: parsed.sugarLevel,
      timestamp: new Date().toISOString(),
      // Replace with real session/user data where appropriate
      userId: 'user123',
      userName: 'Jane Doe',
      doctorId: 'doc456',
      doctorName: 'Dr. Carter',
    });

    console.log('[submitHealthStat] analyzer result:', result);
    return { success: true, alert: result };
  } catch (err) {
    console.error('[submitHealthStat] error:', err);
    if (err instanceof z.ZodError) {
      return { success: false, errorType: 'validation', issues: err.errors };
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
  console.log('[submitAppointment] incoming:', values);
  try {
    const parsed = appointmentSchema.parse(values);
    const appointmentDate = new Date(parsed.datetime);
    const appointment = {
      apptId: uuidv4(),
      patientName: parsed.patientName,
      userId: 'user123',
      doctorId: parsed.doctorId,
      date: appointmentDate.toISOString().split('T')[0],
      time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reason: parsed.reason ?? null,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    console.log('[submitAppointment] created:', appointment);
    // TODO: persist appointment to DB
    return { success: true, appointment };
  } catch (err) {
    console.error('[submitAppointment] error:', err);
    if (err instanceof z.ZodError) return { success: false, errorType: 'validation', issues: err.errors };
    return { success: false, errorType: 'internal', message: (err as Error)?.message ?? String(err) };
  }
}

export async function submitSOS(values: unknown) {
  console.log('[submitSOS] incoming:', values);
  try {
    const schema = z.object({
      userId: z.string().min(1),
      lat: z.coerce.number().gte(-90).lte(90),
      lng: z.coerce.number().gte(-180).lte(180),
      note: z.string().max(1000).optional(),
    });
    const parsed = schema.parse(values);
    const sos = {
      id: uuidv4(),
      userId: parsed.userId,
      location: { lat: parsed.lat, lng: parsed.lng },
      note: parsed.note ?? null,
      createdAt: new Date().toISOString(),
    };
    console.log('[submitSOS] created:', sos);
    // TODO: persist / notify emergency contacts
    return { success: true, sos };
  } catch (err) {
    console.error('[submitSOS] error:', err);
    if (err instanceof z.ZodError) return { success: false, errorType: 'validation', issues: err.errors };
    return { success: false, errorType: 'internal', message: (err as Error)?.message ?? String(err) };
  }
}

export async function submitReminder(values: unknown) {
  console.log('[submitReminder] incoming:', values);
  try {
    const parsed = reminderSchema.parse(values);
    const reminder = {
      id: uuidv4(),
      title: parsed.title,
      datetime: new Date(parsed.datetime).toISOString(),
      note: parsed.note ?? null,
      userId: parsed.userId ?? 'user123',
      createdAt: new Date().toISOString(),
    };
    console.log('[submitReminder] created:', reminder);
    // TODO: persist reminder to DB
    return { success: true, reminder };
  } catch (err) {
    console.error('[submitReminder] error:', err);
    if (err instanceof z.ZodError) return { success: false, errorType: 'validation', issues: err.errors };
    return { success: false, errorType: 'internal', message: (err as Error)?.message ?? String(err) };
  }
}
