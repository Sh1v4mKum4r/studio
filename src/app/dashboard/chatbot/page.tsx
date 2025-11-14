
'use client';
import { AIHealthChatbot } from "@/components/chatbot/ai-health-chatbot";
import { useUser } from "@/firebase";

export default function ChatbotPage() {
    const { user } = useUser();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-full">
            <AIHealthChatbot user={user} />
        </div>
    );
}
