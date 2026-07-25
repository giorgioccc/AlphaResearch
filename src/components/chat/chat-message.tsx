'use client';

import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        'group/message flex w-full items-start gap-3',
        isUser && 'flex-row-reverse'
      )}
    >
      <Avatar size="sm" className="mt-0.5">
        <AvatarFallback
          className={cn(
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white'
          )}
        >
          {isUser ? (
            <User className="size-3.5" />
          ) : (
            <Sparkles className="size-3.5" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          'flex max-w-[80%] min-w-0 flex-col gap-1',
          isUser && 'items-end'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted rounded-tl-sm'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="chat-markdown max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            </div>
          )}
        </div>

        {!isUser && content && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-6 opacity-0 transition-opacity group-hover/message:opacity-100"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span className="sr-only">Copy message</span>
          </Button>
        )}
      </div>
    </div>
  );
}
