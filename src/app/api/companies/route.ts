import { type NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { companyService } from '@/server/services/company.service';

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get('q') ?? '';
  if (q.length < 1) {
    return Response.json([]);
  }

  const companies = await companyService.search(q);
  return Response.json(companies);
}
