
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Pill, Syringe } from "lucide-react";
import type { Reminder } from "@/lib/types";

type RemindersListProps = {
  reminders: Reminder[];
};

export function RemindersList({ reminders }: RemindersListProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reminders.length > 0 ? (
          <ul className="space-y-4">
            {reminders.map((reminder) => (
              <li key={reminder.remId} className="flex items-center space-x-4">
                <div className="rounded-full bg-accent/50 p-2">
                    {reminder.type === 'medication' ? <Pill className="h-5 w-5 text-accent-foreground" /> : <Syringe className="h-5 w-5 text-accent-foreground" />}
                </div>
                <div>
                  <p className="font-medium">{reminder.title}</p>
                  <p className="text-sm text-muted-foreground">{reminder.time}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">You have no reminders set.</p>
        )}
      </CardContent>
    </Card>
  );
}
