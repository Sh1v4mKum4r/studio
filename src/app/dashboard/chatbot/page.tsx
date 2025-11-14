import { AIHealthChatbot } from "@/components/chatbot/ai-health-chatbot";
import { mockUser } from "@/lib/data";

export default function ChatbotPage() {
    // In real app, get user from session
    const user = mockUser;

    return (
        <div className="h-full">
            <AIHealthChatbot user={user} />
        </div>
    );
}
