'use server';

import { aiHealthChatbot } from '@/ai/flows/ai-health-chatbot';
import { analyzeHealthStatsAndGenerateAlerts } from '@/ai/flows/automated-health-alerts';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

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
  // Accepts an ISO datetime string (e.g. "2025-11-14T15:00:00.000Z")
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

export async function submitAppointment(values: unknown) {
  try {
    const parsed = appointmentSchema.parse(values);

    const appointment = {
      id: uuidv4(),
      patientName: parsed.patientName,
      doctorId: parsed.doctorId,
      datetime: new Date(parsed.datetime).toISOString(),
      reason: parsed.reason ?? null,
      createdAt: new Date().toISOString(),
      // attach any user/session data here if needed
    };

    // TODO: persist `appointment` to your DB (Firestore / Prisma / etc.)
    console.log('submitAppointment created:', appointment);

    return { success: true, appointment };
  } catch (err) {
    console.error('submitAppointment error:', err);
    return { success: false, error: (err as Error)?.message ?? String(err) };
  }
}

export async function submitSOS(values: unknown) {
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

    // TODO: persist/send alert (DB, SMS, push, webhook)
    console.log('submitSOS created:', sos);

    return { success: true, sos };
  } catch (err) {
    console.error('submitSOS error:', err);
    return { success: false, error: (err as Error)?.message ?? String(err) };
  }
}

// NEW: reminder schema + server action
export async function submitReminder(values: unknown) {
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

    // TODO: persist `reminder` to your DB (Firestore / Prisma / etc.)
    console.log('submitReminder created:', reminder);

    return { success: true, reminder };
  } catch (err) {
    console.error('submitReminder error:', err);
    return { success: false, error: (err as Error)?.message ?? String(err) };
  }
}
