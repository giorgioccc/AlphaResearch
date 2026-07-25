'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    onDelete(id);
  }

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

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 opacity-0 group-hover:opacity-100"
              disabled={isDeleting}
            />
          }
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only">Delete conversation</span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{title}&rdquo; and all its
              messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
