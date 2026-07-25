import { db } from '@/lib/db';

export const companyRepository = {
  async search(query: string, limit = 10) {
    return db.company.findMany({
      where: {
        OR: [
          { ticker: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        ticker: true,
        name: true,
        sector: true,
        exchange: true,
      },
      orderBy: { name: 'asc' },
      take: limit,
    });
  },

  async findById(id: string) {
    return db.company.findUnique({
      where: { id },
      select: {
        id: true,
        ticker: true,
        name: true,
        sector: true,
        industry: true,
        exchange: true,
      },
    });
  },
};
