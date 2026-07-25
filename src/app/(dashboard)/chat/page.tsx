import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { ChatEmpty } from '@/components/chat/chat-empty';

export const metadata = {
  title: 'Chat — AlphaResearch',
};

export default async function ChatPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return (
    <div className="flex h-full items-center justify-center">
      <ChatEmpty />
    </div>
  );
}
