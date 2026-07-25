'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationItem } from '@/components/chat/conversation-item';

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

  async function handleNewConversation() {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New conversation' }),
    });

    if (res.ok) {
      const conversation = (await res.json()) as { id: string };
      await fetchConversations();
      router.push(`/chat/${conversation.id}`);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchConversations();
      router.push('/chat');
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Conversations</h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={handleNewConversation}
        >
          <Plus className="size-4" />
          <span className="sr-only">New conversation</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-muted-foreground px-3 py-4 text-center text-sm">
            Loading...
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-muted-foreground px-3 py-4 text-center text-sm">
            No conversations yet
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
