
'use client';

import { AiHealthChatbot } from '@/components/chatbot/ai-health-chatbot';

export default function ChatbotPage() {
    return (
        <div className="h-[calc(100vh-10rem)]">
            <h1 className="text-3xl font-bold mb-4">AI Health Assistant</h1>
            <p className="text-muted-foreground mb-6">
                Ask questions about your health data, appointments, or general pregnancy-related topics.
            </p>
            <div className="mx-auto w-full max-w-[600px] h-[calc(100%-8rem)]">
                <AiHealthChatbot />
            </div>
        </div>
    );
}
