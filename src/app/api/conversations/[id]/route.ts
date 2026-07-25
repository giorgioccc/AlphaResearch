import { type NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { chatService } from '@/server/services/chat.service';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await chatService.getConversation(id, session.user.id);

  if (!conversation) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(conversation);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await chatService.deleteConversation(id, session.user.id);

  return Response.json({ success: true });
}
