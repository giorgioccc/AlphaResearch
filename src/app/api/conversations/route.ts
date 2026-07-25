import { type NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { chatService } from '@/server/services/chat.service';

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversations = await chatService.getConversations(session.user.id);
  return Response.json(conversations);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    companyId?: string;
  };

  const conversation = await chatService.createConversation(
    session.user.id,
    body.title,
    body.companyId
  );

  return Response.json(conversation, { status: 201 });
}
