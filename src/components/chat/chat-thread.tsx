'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { ChatMessage } from '@/components/chat/chat-message';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatEmpty } from '@/components/chat/chat-empty';
import { Loader2, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatThreadProps {
  conversationId: string;
  initialMessages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  }[];
}

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export function ChatThread({
  conversationId,
  initialMessages,
}: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const [input, setInput] = useState('');

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: { conversationId },
      }),
    [conversationId]
  );

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport,
    messages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: [{ type: 'text' as const, text: m.content }],
    })),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (isAtBottomRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 100;
    isAtBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }

  async function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    await sendMessage({ text: trimmed });
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4"
      >
        {messages.length === 0 ? (
          <ChatEmpty />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role as 'user' | 'assistant'}
                content={getTextContent(message)}
              />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex items-center gap-3">
                <Avatar size="sm" className="mt-0.5">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                    <Sparkles className="size-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted flex items-center gap-2 rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
                  <span className="text-muted-foreground text-sm">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 mb-2 flex items-center gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="size-4 shrink-0" />
          <span className="flex-1">
            {error.message || 'Something went wrong. Please try again.'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
            onClick={() => regenerate()}
          >
            <RotateCcw className="mr-1 size-3" />
            Retry
          </Button>
        </div>
      )}

      <div className="border-t p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
