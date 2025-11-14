import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Appointment, Doctor } from "@/lib/types";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

type UpcomingAppointmentsProps = {
  appointments: Appointment[];
  doctors: Doctor[];
};

export function UpcomingAppointments({ appointments, doctors }: UpcomingAppointmentsProps) {
  const upcoming = appointments
    .filter(a => new Date(a.date) >= new Date() && a.status === 'confirmed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const getDoctor = (doctorId: string) => doctors.find(d => d.doctorId === doctorId);

  return (
    <Card className="col-span-1 xl:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5"/>
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcoming.length > 0 ? (
          <ul className="space-y-4">
            {upcoming.map((appt) => {
              const doctor = getDoctor(appt.doctorId);
              return (
                <li key={appt.apptId} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={doctor?.avatarUrl} alt={doctor?.name} data-ai-hint={doctor?.imageHint} />
                    <AvatarFallback>{doctor?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{appt.reason}</p>
                    <p className="text-sm text-muted-foreground">
                      {doctor?.name} &middot; {format(new Date(appt.date), "EEE, MMM d")} at {appt.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
        )}
      </CardContent>
    </Card>
  );
}
