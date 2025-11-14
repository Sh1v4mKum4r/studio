'use client';

import { AppointmentScheduler } from "@/components/appointments/appointment-scheduler";
import { mockDoctors } from "@/lib/data";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Appointment } from "@/lib/types";

export default function AppointmentsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    // Memoize the query to prevent re-renders
    const appointmentsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'appointments'), where('patientId', '==', user.uid));
    }, [user, firestore]);

    const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

    if (isLoading || !appointments) {
        return <div>Loading appointments...</div>;
    }

    // In a real app, you would fetch this data
    const doctors = mockDoctors;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Appointments</h1>
            <AppointmentScheduler appointments={appointments || []} doctors={doctors} />
        </div>
    );
}
