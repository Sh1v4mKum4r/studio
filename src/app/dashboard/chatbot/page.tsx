
'use client';

import { AiHealthChatbot } from '@/components/chatbot/ai-health-chatbot';

export default function ChatbotPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <h1 className="text-3xl font-bold mb-4">AI Health Assistant</h1>
            <p className="text-muted-foreground mb-6">
                Ask questions about your health data, appointments, or general pregnancy-related topics.
            </p>
            <div className="flex-1 flex flex-col">
                <AiHealthChatbot />
            </div>
        </div>
    );
}
