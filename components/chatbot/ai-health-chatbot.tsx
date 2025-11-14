'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getChatbotResponse } from '@/app/actions';

type Message = {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  time: string;
};

export default function AIHealthChatbot({ userId }: { userId: string }) {
  const STORAGE_KEY = `ai-chat-${userId ?? 'anon'}`;
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : ([] as Message[]);
    } catch {
      return [] as Message[];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
    // auto-scroll to bottom on new message
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function addMessage(msg: Message) {
    setMessages((m) => [...m, msg]);
  }

  async function send(text?: string) {
    setError(null);
    const trimmed = (text ?? input).trim();
    if (!trimmed) {
      setError('Please enter a question.');
      return;
    }
    if (!userId || !userId.trim()) {
      setError('Missing user id.');
      return;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInput('');
    setLoading(true);

    const botPlaceholder: Message = {
      id: `b-${Date.now()}`,
      sender: 'bot',
      text: '...',
      time: new Date().toISOString(),
    };
    addMessage(botPlaceholder);

    try {
      const res = await getChatbotResponse(userId.trim(), trimmed);
      const botText = (res && (res.answer ?? res.text ?? JSON.stringify(res))) || "I couldn't process that. Try again.";
      // replace last bot placeholder with actual bot message
      setMessages((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((m) => m.id === botPlaceholder.id);
        const botMsg: Message = {
          id: botPlaceholder.id,
          sender: 'bot',
          text: botText,
          time: new Date().toISOString(),
        };
        if (idx >= 0) copy[idx] = botMsg;
        else copy.push(botMsg);
        return copy;
      });
    } catch (err) {
      console.error('chat error', err);
      setMessages((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((m) => m.id === botPlaceholder.id);
        const botMsg: Message = {
          id: botPlaceholder.id,
          sender: 'bot',
          text: "Sorry, I couldn't reach the assistant. Please try again later.",
          time: new Date().toISOString(),
        };
        if (idx >= 0) copy[idx] = botMsg;
        else copy.push(botMsg);
        return copy;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  function clearConversation() {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setError(null);
    inputRef.current?.focus();
  }

  return (
    <div className="ai-chat-container" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        className="ai-chat-list"
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 12,
          height: 320,
          overflowY: 'auto',
          background: '#fff',
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: '#6b7280', textAlign: 'center', paddingTop: 40 }}>
            Ask about symptoms, vitals, or scheduling — press Enter to send.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                maxWidth: '78%',
                padding: '8px 12px',
                borderRadius: 12,
                background: m.sender === 'user' ? '#0ea5a4' : '#f3f4f6',
                color: m.sender === 'user' ? '#fff' : '#111827',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 14,
              }}
            >
              <div style={{ marginBottom: 6 }}>{m.text}</div>
              <div style={{ fontSize: 11, opacity: 0.65, textAlign: 'right' }}>
                {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'flex-end' }}>
        <textarea
          ref={inputRef}
          aria-label="Ask AI health assistant"
          placeholder="Type your question... (Shift+Enter for newline)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          style={{
            flex: 1,
            resize: 'none',
            padding: 10,
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            fontSize: 14,
            minHeight: 48,
          }}
          disabled={loading}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading}
            aria-disabled={loading}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: '#0ea5a4',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              minWidth: 80,
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>

          <button
            type="button"
            onClick={clearConversation}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              background: '#f3f4f6',
              color: '#111827',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              minWidth: 80,
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" style={{ marginTop: 8, color: '#b91c1c', fontSize: 13 }}>
          {error}
        </div>
      )}
    </div>
  );
}