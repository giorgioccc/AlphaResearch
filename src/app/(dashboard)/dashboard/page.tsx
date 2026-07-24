import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';

export const metadata = {
  title: 'Dashboard — AlphaResearch',
};

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name ?? 'researcher'}.
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <h2 className="mb-2 text-lg font-semibold">Your session</h2>
        <dl className="space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="text-muted-foreground font-medium">Email:</dt>
            <dd>{session.user.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted-foreground font-medium">User ID:</dt>
            <dd className="font-mono text-xs">{session.user.id}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted-foreground font-medium">
              Session expires:
            </dt>
            <dd>{new Date(session.session.expiresAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
