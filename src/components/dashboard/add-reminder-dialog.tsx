
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

const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  datetime: z.string().min(1, "Time is required"),
  note: z.string().optional(),
});

export function AddReminderDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reminderSchema>>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
      datetime: '',
      note: '',
    },
  });

  async function onSubmit(values: z.infer<typeof reminderSchema>) {
    setIsSubmitting(true);
    
    // Create a valid date from today and the time
    const [hours, minutes] = values.datetime.split(':');
    const reminderDate = new Date();
    reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const result = await submitReminder({
      ...values,
      datetime: reminderDate.toISOString(),
      userId: 'user123',
    });
    
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Reminder Set!',
        description: `We'll remind you about "${values.title}".`,
      });
      form.reset();
      setIsOpen(false);
    } else {
      toast({
        title: 'Error',
        description: 'Could not save reminder. Please try again.',
        variant: 'destructive',
      });
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
