
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
import { useToast } from '@/hooks/use-toast';
import { submitReminder } from '@/app/actions';
import { Loader2, Plus } from 'lucide-react';
import type { Reminder } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  datetime: z.string().min(1, "Time is required"),
  type: z.enum(['medication', 'vaccination']),
  note: z.string().optional(),
});

type AddReminderDialogProps = {
  onReminderAdded: (reminder: Reminder) => void;
};

export function AddReminderDialog({ onReminderAdded }: AddReminderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof reminderSchema>>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
      datetime: '',
      type: 'medication',
      note: '',
    },
  });

  async function onSubmit(values: z.infer<typeof reminderSchema>) {
    if (!user) {
      toast({ title: "Not Authenticated", description: "You must be logged in to add a reminder.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    const [hours, minutes] = values.datetime.split(':');
    const reminderDate = new Date();
    reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const newReminder = {
      remId: uuidv4(),
      userId: user.uid,
      title: values.title,
      datetime: reminderDate.toISOString(),
      reminderDateTime: reminderDate.toISOString(),
      type: values.type,
      reminderType: values.type,
      note: values.note ?? null,
      message: values.title,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    try {
      const remindersCol = collection(firestore, `users/${user.uid}/reminders`);
      await addDocumentNonBlocking(remindersCol, newReminder);

      // This server action can be used for other side-effects, like queuing a push notification
      await submitReminder(values);

      const displayReminder: Reminder = {
        ...newReminder,
        time: new Date(newReminder.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onReminderAdded(displayReminder);
      
      toast({
        title: 'Reminder Set!',
        description: `We'll remind you about "${values.title}".`,
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding reminder:", error);
       toast({
        title: 'Error',
        description: 'Could not save reminder. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
          <DialogDescription>
            Set a new reminder for medication or appointments.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Prenatal Vitamins" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="datetime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="medication">Medication</SelectItem>
                            <SelectItem value="vaccination">Vaccination</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., With breakfast" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Reminder
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
