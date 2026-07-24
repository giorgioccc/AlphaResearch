'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export function UserNav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="bg-muted h-9 w-24 animate-pulse rounded-md" />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-muted-foreground text-sm">
        {session.user.name ?? session.user.email}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await signOut();
          router.push('/login');
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
