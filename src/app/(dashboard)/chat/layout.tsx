import { ConversationList } from '@/components/chat/conversation-list';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <aside className="hidden w-72 shrink-0 border-r md:block">
        <ConversationList />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
