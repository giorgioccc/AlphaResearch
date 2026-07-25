import { ConversationList } from '@/components/chat/conversation-list';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full overflow-hidden">
      <aside className="hidden w-72 shrink-0 border-r md:block">
        <ConversationList />
      </aside>
      <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
