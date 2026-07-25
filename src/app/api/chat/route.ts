import { type NextRequest } from 'next/server';
import type { UIMessage } from 'ai';
import { getServerSession } from '@/lib/auth-server';
import { chatService } from '@/server/services/chat.service';

function getTextFromParts(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as {
    messages: UIMessage[];
    conversationId: string;
  };

  const { messages, conversationId } = body;
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.role !== 'user') {
    return Response.json({ error: 'Invalid message' }, { status: 400 });
  }

  const userContent = getTextFromParts(lastMessage);
  if (!userContent) {
    return Response.json({ error: 'Empty message' }, { status: 400 });
  }

  if (!conversationId) {
    return Response.json(
      { error: 'conversationId is required' },
      { status: 400 }
    );
  }

  try {
    const result = await chatService.sendMessage(
      conversationId,
      session.user.id,
      userContent
    );

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    const status = message === 'Conversation not found' ? 404 : 500;
    return Response.json({ error: message }, { status });
  }
}
