'use client';
import React, { useState } from 'react';
import { submitReminder } from '@/app/actions';

export default function ReminderForm({ userId }: { userId?: string }) {
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    setLoading(true);
    try {
      const res = await submitReminder({
        title,
        datetime, // ensure this is an ISO string or a string parseable by Date
        note,
        userId,
      });
      if (res?.success) {
        setMsg('Reminder created');
        setTitle('');
        setDatetime('');
        setNote('');
      } else {
        setMsg('Failed: ' + (res?.error ?? 'unknown'));
      }
    } catch (err) {
      console.error(err);
      setMsg('Error sending request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input value={datetime} onChange={(e) => setDatetime(e.target.value)} placeholder="2025-11-14T15:00:00.000Z" required />
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" />
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}