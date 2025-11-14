
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitAppointment } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import type { Doctor } from '@/lib/types';
import { format } from 'date-fns';

const appointmentSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  doctorId: z.string().min(1, "Please select a doctor"),
  reason: z.string().min(1, "Reason for appointment is required"),
});

type AddAppointmentDialogProps = {
  selectedDate: Date;
  timeSlot: string;
  doctors: Doctor[];
  userId: string;
};

export function AddAppointmentDialog({ selectedDate, timeSlot, doctors, userId }: AddAppointmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: 'Jane Doe',
      doctorId: '',
      reason: '',
    },
  });

  async function onSubmit(values: z.infer<typeof appointmentSchema>) {
    setIsSubmitting(true);
    const appointmentDateTime = new Date(selectedDate);
    const [time, period] = timeSlot.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const result = await submitAppointment({
      ...values,
      datetime: appointmentDateTime.toISOString(),
    });

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Appointment Scheduled!',
        description: `Your appointment with Dr. ${doctors.find(d => d.doctorId === values.doctorId)?.name} has been booked.`,
      });
      form.reset();
      setIsOpen(false);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{timeSlot}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Booking for {format(selectedDate, 'PPP')} at {timeSlot}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Appointment</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Monthly check-up" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map(doc => (
                        <SelectItem key={doc.doctorId} value={doc.doctorId}>{doc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
