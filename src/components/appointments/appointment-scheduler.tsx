'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Appointment, Doctor } from '@/lib/types';
import { format, isSameDay, isAfter, startOfToday } from 'date-fns';
import { AddAppointmentDialog } from './add-appointment-dialog';
import { Badge } from '@/components/ui/badge';

type AppointmentSchedulerProps = {
  appointments: Appointment[];
  doctors: Doctor[];
};

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
];

export function AppointmentScheduler({ appointments: initialAppointments, doctors }: AppointmentSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const handleAppointmentBooked = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment]);
  }
  
  const selectedDayAppointments = appointments.filter(
    (appt) => date && isSameDay(new Date(appt.date), date)
  );

  const availableSlots = timeSlots.filter(
    slot => !selectedDayAppointments.some(appt => appt.time === slot)
  );

  const statusVariant = (status: 'confirmed' | 'pending' | 'cancelled') => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Schedule an Appointment</CardTitle>
          <CardDescription>Select a date to see available time slots.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(day) => !isAfter(day, startOfToday()) || isSameDay(day, startOfToday())}
          />
          <div className="flex-1">
            <h3 className="mb-4 text-center text-lg font-medium md:text-left">
              Available Slots for {date ? format(date, 'PPP') : 'today'}
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {date && availableSlots.map(slot => (
                <AddAppointmentDialog 
                  key={slot} 
                  selectedDate={date} 
                  timeSlot={slot} 
                  doctors={doctors}
                  userId="user123" 
                  onAppointmentBooked={handleAppointmentBooked}
                />
              ))}
               {availableSlots.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No available slots for this day.</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
          <CardDescription>A list of your scheduled appointments.</CardDescription>
        </CardHeader>
        <CardContent>
           <ul className="space-y-4">
            {appointments.map((appt) => {
              const doctor = doctors.find(d => d.doctorId === appt.doctorId);
              return (
                <li key={appt.apptId} className="p-3 rounded-md border space-y-1">
                  <div className='flex justify-between items-start'>
                    <p className="font-semibold">{appt.reason}</p>
                    <Badge variant={statusVariant(appt.status)} className='capitalize'>{appt.status}</Badge>
                  </div>
                  <p className="text-sm">With: {doctor?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(appt.date), "EEE, MMM d, yyyy")} at {appt.time}
                  </p>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
