import { db } from '@/lib/db';

const ACTIVE_FILTER = { deletedAt: null } as const;

export const conversationRepository = {
  async findByUserId(userId: string) {
    return db.conversation.findMany({
      where: { userId, ...ACTIVE_FILTER },
      orderBy: { updatedAt: 'desc' },
      include: {
        company: { select: { id: true, ticker: true, name: true } },
        _count: { select: { messages: true } },
      },
    });
  },

  async findById(id: string, userId: string) {
    return db.conversation.findFirst({
      where: { id, userId, ...ACTIVE_FILTER },
      include: {
        company: {
          select: {
            id: true,
            ticker: true,
            name: true,
            sector: true,
            industry: true,
          },
        },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
  },

  async create(data: {
    userId: string;
    title: string;
    companyId?: string;
    workspaceId?: string;
  }) {
    return db.conversation.create({ data });
  },

  async updateTitle(id: string, userId: string, title: string) {
    return db.conversation.updateMany({
      where: { id, userId, ...ACTIVE_FILTER },
      data: { title },
    });
  },

  async softDelete(id: string, userId: string) {
    return db.conversation.updateMany({
      where: { id, userId, ...ACTIVE_FILTER },
      data: { deletedAt: new Date() },
    });
  },
};
