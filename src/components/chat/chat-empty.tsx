import { MessageSquare } from 'lucide-react';

export function ChatEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
      <div className="bg-muted flex size-16 items-center justify-center rounded-2xl">
        <MessageSquare className="text-muted-foreground size-8" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Start a conversation</h2>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Ask about companies, financial statements, market trends, or
          investment concepts.
        </p>
      </div>
    </div>
  );
}
