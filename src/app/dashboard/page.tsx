
import { StatCard } from "@/components/dashboard/stat-card";
import { HealthStatsChart } from "@/components/dashboard/health-stats-chart";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { RemindersList } from "@/components/dashboard/reminders-list";
import { mockDoctors, mockHealthStats, mockAppointments, mockReminders } from "@/lib/data";
import { Beaker, HeartPulse, Weight } from "lucide-react";
import { format } from 'date-fns';

export default function DashboardPage() {
  // In a real app, this data would be fetched from an API
  const healthStats = mockHealthStats;
  const appointments = mockAppointments;
  const reminders = mockReminders;
  const doctors = mockDoctors;

  const latestStat = healthStats[healthStats.length - 1];
  const latestBp = `${latestStat.bloodPressure.systolic}/${latestStat.bloodPressure.diastolic}`;

  return (
    <div className="flex flex-col gap-6">
       <h1 className="text-2xl font-semibold md:hidden">
            Welcome back!
        </h1>
        <p className="text-sm text-muted-foreground">
            Here&apos;s your health summary as of {format(new Date(latestStat.timestamp), "MMMM d, yyyy")}.
        </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={HeartPulse}
          title="Blood Pressure"
          value={latestBp}
          description="Last measurement"
          alertLevel={latestStat.alertLevel}
        />
        <StatCard
          icon={Beaker}
          title="Sugar Level"
          value={`${latestStat.sugarLevel} mg/dL`}
          description="Fasting"
          alertLevel={latestStat.alertLevel}
        />
        <StatCard
          icon={Weight}
          title="Weight"
          value={`${latestStat.weight.toFixed(1)} kg`}
          description="Weekly measurement"
        />
         <StatCard
          icon={HeartPulse}
          title="Heart Rate"
          value={`${latestStat.heartRate} BPM`}
          description="At rest"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <HealthStatsChart stats={healthStats} />
        <UpcomingAppointments appointments={appointments} doctors={doctors} />
        <RemindersList reminders={reminders} />
      </div>
    </div>
  );
}
