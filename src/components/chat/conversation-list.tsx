'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ConversationItem } from '@/components/chat/conversation-item';
import { NewConversationDialog } from '@/components/chat/new-conversation-dialog';

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  company: { ticker: string } | null;
  _count: { messages: number };
}

export function ConversationList() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        setConversations((await res.json()) as Conversation[]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Conversation deleted');
      await fetchConversations();
      router.push('/chat');
    } else {
      toast.error('Failed to delete conversation');
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Conversations</h2>
        <NewConversationDialog onCreated={fetchConversations} />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg px-3 py-2">
                <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
                <div className="bg-muted h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-muted-foreground px-3 py-8 text-center text-sm">
            <p>No conversations yet.</p>
            <p className="mt-1">Click the + button to start one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                id={conv.id}
                title={conv.title}
                companyTicker={conv.company?.ticker}
                messageCount={conv._count.messages}
                updatedAt={conv.updatedAt}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
