
'use client';

import { AppointmentScheduler } from "@/components/appointments/appointment-scheduler";
import { mockDoctors } from "@/lib/data";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Appointment } from "@/lib/types";

// This component contains the main logic and is rendered only when user and firestore are available.
function AppointmentsView({ user, firestore }: { user: NonNullable<ReturnType<typeof useUser>['user']>, firestore: NonNullable<ReturnType<typeof useFirestore>> }) {
    const appointmentsQuery = useMemoFirebase(() => {
        // We know user and firestore are defined here.
        return query(collection(firestore, 'appointments'), where('patientId', '==', user.uid));
    }, [user.uid, firestore]);

    const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

    if (isLoading) {
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


export default function AppointmentsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    // Show a loading state while user or firestore are initializing.
    if (isUserLoading || !user || !firestore) {
        return <div>Loading...</div>;
    }
    
    // Once everything is loaded, render the component that performs the query.
    return <AppointmentsView user={user} firestore={firestore} />;
}
