import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockReminders } from "@/lib/data";
import { Bell, Pill, Plus, Syringe } from "lucide-react";

export default function RemindersPage() {
    const reminders = mockReminders;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Reminders</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Reminder
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Reminders</CardTitle>
                    <CardDescription>A list of your medication and vaccination reminders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {reminders.map((reminder) => (
                            <div key={reminder.remId} className="flex items-center space-x-4 rounded-lg border p-4">
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
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
