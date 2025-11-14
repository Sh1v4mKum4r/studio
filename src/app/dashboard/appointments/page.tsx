import { AppointmentScheduler } from "@/components/appointments/appointment-scheduler";
import { mockAppointments, mockDoctors } from "@/lib/data";

export default function AppointmentsPage() {
  // In a real app, fetch this data
  const appointments = mockAppointments;
  const doctors = mockDoctors;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Appointments</h1>
      <AppointmentScheduler appointments={appointments} doctors={doctors} />
    </div>
  );
}
