'use client';

import { useRef, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUp, CornerDownLeft, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const MAX_LENGTH = 4000;

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = input.trim().length > 0 && !isLoading;

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    if (canSend) onSubmit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  }

  function adjustHeight() {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }

  const isNearLimit = input.length > MAX_LENGTH * 0.9;

  return (
    <form onSubmit={handleFormSubmit}>
      <div
        className={cn(
          'border-input bg-background focus-within:ring-ring/40 focus-within:border-ring flex flex-col gap-1 rounded-2xl border shadow-sm transition-shadow focus-within:ring-4',
          isLoading && 'opacity-90'
        )}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            onInputChange(e.target.value.slice(0, MAX_LENGTH));
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a company, financial concept, or market trend..."
          rows={1}
          maxLength={MAX_LENGTH}
          disabled={isLoading}
          className="placeholder:text-muted-foreground max-h-[200px] min-h-[52px] w-full resize-none bg-transparent px-4 pt-3.5 text-sm outline-none disabled:cursor-not-allowed"
        />

        <div className="flex items-center justify-between gap-2 px-3 pb-2.5">
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <CornerDownLeft className="size-3" />
            <span>Send</span>
            <span className="mx-1 opacity-50">·</span>
            <span>Shift + Enter for new line</span>
            {isNearLimit && (
              <span className="ml-2 text-amber-600 dark:text-amber-500">
                {input.length}/{MAX_LENGTH}
              </span>
            )}
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            className="h-8 w-8 shrink-0 rounded-full"
          >
            {isLoading ? (
              <Square className="size-3 fill-current" />
            ) : (
              <ArrowUp className="size-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
