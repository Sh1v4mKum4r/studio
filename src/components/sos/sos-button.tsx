
'use client';
import React, { useState } from 'react';
import { submitSOS } from '@/app/actions';
import { Button } from '../ui/button';
import { ShieldAlert } from 'lucide-react';

export default function SOSButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleClick() {
    setMsg(null);
    if (!navigator.geolocation) {
      setMsg('Geolocation not supported.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await submitSOS({
            userId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            note: 'SOS triggered from app',
          });
          if (result?.success) setMsg('SOS sent.');
          else setMsg('Failed to send SOS: ' + (result?.error ?? 'unknown'));
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
      {msg && <div>{msg}</div>}
    </div>
  );
}
