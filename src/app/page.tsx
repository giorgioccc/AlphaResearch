import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">AlphaResearch</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          AI-powered financial research, simplified.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/register"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Get started
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
