'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ConversationItemProps {
  id: string;
  title: string;
  companyTicker?: string | null;
  messageCount: number;
  updatedAt: string;
  onDelete: (id: string) => void;
}

export function ConversationItem({
  id,
  title,
  companyTicker,
  messageCount,
  updatedAt,
  onDelete,
}: ConversationItemProps) {
  const pathname = usePathname();
  const isActive = pathname === `/chat/${id}`;

  return (
    <div
      className={cn(
        'group flex items-center gap-1 rounded-lg px-3 py-2 transition-colors',
        isActive ? 'bg-accent' : 'hover:bg-accent/50'
      )}
    >
      <Link href={`/chat/${id}`} className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-muted-foreground truncate text-xs">
          {companyTicker && (
            <span className="bg-muted mr-1 inline-block rounded px-1 py-0.5 text-[10px] font-medium">
              {companyTicker}
            </span>
          )}
          {messageCount} messages · {new Date(updatedAt).toLocaleDateString()}
        </p>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.preventDefault();
          onDelete(id);
        }}
      >
        <Trash2 className="size-3.5" />
        <span className="sr-only">Delete conversation</span>
      </Button>
    </div>
  );
}
