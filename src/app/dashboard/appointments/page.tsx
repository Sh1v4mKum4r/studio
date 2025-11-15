
'use client';

import { AppointmentScheduler } from "@/components/appointments/appointment-scheduler";
import { mockDoctors } from "@/lib/data";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Appointment } from "@/lib/types";

export default function AppointmentsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const appointmentsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'appointments'), where('patientId', '==', user.uid));
    }, [user, firestore]);

    const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

    if (isLoading || !user) {
        return <div>Loading appointments...</div>;
    }

    const doctors = mockDoctors;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Appointments</h1>
            </div>
            <AppointmentScheduler appointments={appointments || []} doctors={doctors} />
        </div>
    );
}
