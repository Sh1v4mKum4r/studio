'use server';

/**
 * @fileOverview A flow for automated health alerts based on health stats.
 *
 * - analyzeHealthStatsAndGenerateAlerts - Analyzes health stats and generates alerts if they fall into critical or warning ranges.
 * - HealthStatsInput - The input type for the analyzeHealthStatsAndGenerateAlerts function.
 * - HealthAlertOutput - The return type for the analyzeHealthStatsAndGenerateAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthStatsInputSchema = z.object({
  bloodPressure: z
    .number()
    .describe('Systolic blood pressure in mmHg'),
  sugarLevel: z.number().describe('Blood sugar level in mg/dL'),
  timestamp: z.string().describe('Timestamp of the health stats entry'),
  userId: z.string().describe('The ID of the user to send the alert to.'),
  userName: z.string().describe('The name of the user to send the alert to.'),
  doctorId: z.string().describe('The ID of the doctor to send the alert to.'),
  doctorName: z.string().describe('The name of the doctor to send the alert to.'),
});
export type HealthStatsInput = z.infer<typeof HealthStatsInputSchema>;

const HealthAlertOutputSchema = z.object({
  alertLevel: z.enum(['critical', 'warning', 'normal']).describe('The alert level based on the health stats.'),
  alertMessage: z.string().describe('A message describing the alert and recommended actions.'),
  shouldSendNotification: z.boolean().describe('Whether or not a notification should be sent.'),
});
export type HealthAlertOutput = z.infer<typeof HealthAlertOutputSchema>;

export async function analyzeHealthStatsAndGenerateAlerts(
  input: HealthStatsInput
): Promise<HealthAlertOutput> {
  return analyzeHealthStatsAndGenerateAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthStatsAlertPrompt',
  input: {schema: HealthStatsInputSchema},
  output: {schema: HealthAlertOutputSchema},
  prompt: `You are a healthcare assistant that helps analyze patient health data and generate alerts.

  Based on the provided health stats, determine the alert level and generate a message.

  Health Stats:
  - Blood Pressure: {{{bloodPressure}}} mmHg
  - Sugar Level: {{{sugarLevel}}} mg/dL
  - Timestamp: {{{timestamp}}}

  Alert Criteria:
  - Critical: BP ≥ 160 or Sugar ≥ 250
  - Warning: BP ≥ 140 or Sugar ≥ 180
  - Normal: Otherwise

  Include the user's name ({{{userName}}}) and the doctor's name ({{{doctorName}}}) in the message.

  Output should include:
  - alertLevel (critical, warning, or normal)
  - alertMessage (a detailed message describing the alert and recommended actions)
  - shouldSendNotification (true if alertLevel is critical or warning, false otherwise)

  Example:
  {
    "alertLevel": "warning",
    "alertMessage": "Warning: Blood pressure is elevated ({{{bloodPressure}}} mmHg). Please rest and monitor. Contact your doctor if it remains high. Doctor {{{doctorName}}} has been notified.",
    "shouldSendNotification": true
  }
  `,
});

const analyzeHealthStatsAndGenerateAlertsFlow = ai.defineFlow(
  {
    name: 'analyzeHealthStatsAndGenerateAlertsFlow',
    inputSchema: HealthStatsInputSchema,
    outputSchema: HealthAlertOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
