
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChatbotResponse } from '@/app/actions';
import type { ChatMessage } from '@/lib/types';
import type { User } from 'firebase/auth';
import { Send, Loader2, HeartPulse } from 'lucide-react';

type AIHealthChatbotProps = {
  user: User;
};

export function AIHealthChatbot({ user }: AIHealthChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI health assistant. How can I help you today? You can ask me about symptoms, nutrition, or anything related to your pregnancy.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    startTransition(async () => {
      const response = await getChatbotResponse(user.uid, inputValue);
      if (response.success && response.answer) {
        const assistantMessage: ChatMessage = {
          id: Date.now().toString() + 'ai',
          role: 'assistant',
          content: response.answer,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
         const assistantMessage: ChatMessage = {
            id: Date.now().toString() + 'ai',
            role: 'assistant',
            content: "Sorry, I couldn't get a response. Please try again.",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="border-b">
        <CardTitle>AI Health Chatbot</CardTitle>
        <CardDescription>Your personal AI assistant for pregnancy-related questions.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 border border-primary/50">
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                        <HeartPulse className="h-5 w-5" />
                    </div>
                  </Avatar>
                )}
                <div
                  className={`max-w-md rounded-lg px-4 py-3 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && (
              <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8 border border-primary/50">
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                        <HeartPulse className="h-5 w-5" />
                    </div>
                  </Avatar>
                <div className="max-w-md rounded-lg bg-muted px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question... (Shift+Enter for new line)"
            disabled={isPending}
            rows={1}
            className="flex-1 min-h-[48px] max-h-48 resize-y"
          />
          <Button type="submit" size="icon" disabled={isPending || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
