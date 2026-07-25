import type { MessageRole } from '@prisma/client';
import { db } from '@/lib/db';

export const messageRepository = {
  async findByConversationId(conversationId: string) {
    return db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  },

  async create(data: {
    conversationId: string;
    role: MessageRole;
    content: string;
  }) {
    return db.message.create({ data });
  },

  async createWithTokens(data: {
    conversationId: string;
    role: MessageRole;
    content: string;
    inputTokens: number;
    outputTokens: number;
    citations?: unknown;
  }) {
    return db.message.create({
      data: {
        conversationId: data.conversationId,
        role: data.role,
        content: data.content,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        citations: data.citations as never,
      },
    });
  },
};
