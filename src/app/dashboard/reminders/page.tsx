
'use client';

import { useState } from 'react';
import { AddReminderDialog } from '@/components/dashboard/add-reminder-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockReminders as initialReminders } from '@/lib/data';
import type { Reminder } from '@/lib/types';
import { Pill, Syringe, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);

  const handleReminderAdded = (newReminder: Reminder) => {
    setReminders((prev) => [...prev, newReminder]);
  };

  const handleDeleteReminder = () => {
    if (reminderToDelete) {
      setReminders((prev) => prev.filter((r) => r.remId !== reminderToDelete.remId));
      setReminderToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Reminders</h1>
        <AddReminderDialog onReminderAdded={handleReminderAdded} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Reminders</CardTitle>
          <CardDescription>A list of your medication and vaccination reminders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reminders.map((reminder) => (
              <div key={reminder.remId} className="relative flex items-center space-x-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/50">
                  {reminder.type === 'medication' ? (
                    <Pill className="h-6 w-6 text-accent-foreground" />
                  ) : (
                    <Syringe className="h-6 w-6 text-accent-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold">{reminder.title}</p>
                  <p className="text-muted-foreground">{reminder.time}</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => setReminderToDelete(reminder)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the reminder for &quot;{reminder.title}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setReminderToDelete(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteReminder}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
             {reminders.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground">You have no reminders set.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
