import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Sign In — AlphaResearch',
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
