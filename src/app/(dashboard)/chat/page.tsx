import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { MessageSquare, TrendingUp, Building2, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Chat — AlphaResearch',
};

const suggestions = [
  {
    icon: TrendingUp,
    text: 'Explain the P/E ratio',
  },
  {
    icon: Building2,
    text: 'Compare AAPL and MSFT',
  },
  {
    icon: BookOpen,
    text: 'What is a balance sheet?',
  },
];

export default async function ChatPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
      <div className="bg-muted flex size-16 items-center justify-center rounded-2xl">
        <MessageSquare className="text-muted-foreground size-8" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Welcome to AlphaResearch Chat</h2>
        <p className="text-muted-foreground mt-1 max-w-md text-sm">
          Your AI financial research assistant. Create a new conversation from
          the sidebar to get started.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <div
            key={s.text}
            className="bg-muted text-muted-foreground flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          >
            <s.icon className="size-4" />
            {s.text}
          </div>
        ))}
      </div>
    </div>
  );
}
