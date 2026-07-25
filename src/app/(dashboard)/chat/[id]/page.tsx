import { redirect, notFound } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { chatService } from '@/server/services/chat.service';
import { ChatThread } from '@/components/chat/chat-thread';

export const metadata = {
  title: 'Chat — AlphaResearch',
};

export default async function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  if (!session) redirect('/login');

  const { id } = await params;
  const conversation = await chatService.getConversation(id, session.user.id);

  if (!conversation) notFound();

  const initialMessages = conversation.messages
    .filter((m) => m.role !== 'SYSTEM')
    .map((m) => ({
      id: m.id,
      role: m.role.toLowerCase() as 'user' | 'assistant',
      content: m.content,
    }));

  return <ChatThread conversationId={id} initialMessages={initialMessages} />;
}
