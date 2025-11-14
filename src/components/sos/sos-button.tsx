
'use client';
import React, { useState } from 'react';
import { submitSOS } from '@/app/actions';
import { Button } from '../ui/button';
import { ShieldAlert } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export default function SOSButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();

  async function handleClick() {
    setMsg(null);
    if (!user) {
      setMsg('You must be logged in to send an SOS.');
      return;
    }
    if (!navigator.geolocation) {
      setMsg('Geolocation not supported.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const sosData = {
            id: uuidv4(),
            userId: user.uid,
            eventDateTime: serverTimestamp(),
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            },
            message: 'SOS triggered from app',
          };
          
          const sosCol = collection(firestore, `users/${user.uid}/sos_events`);
          await addDocumentNonBlocking(sosCol, sosData);

          // This server action can be used for other side-effects, like notifying emergency contacts
          await submitSOS({
            userId: user.uid,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            note: 'SOS triggered from app',
          });

          setMsg('SOS sent.');
        } catch (err) {
          console.error(err);
          setMsg('Error sending SOS.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('geolocation error', err);
        setMsg('Permission denied / location unavailable.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div>
        <Button variant="destructive" size="sm" onClick={handleClick} disabled={loading}>
            <ShieldAlert className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">{loading ? 'Sending...' : 'SOS'}</span>
        </Button>
      {msg && <div className="text-xs text-red-500 mt-1">{msg}</div>}
    </div>
  );
}
