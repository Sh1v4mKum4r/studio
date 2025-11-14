
'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async ({ email, password }: any) => {
    try {
      initiateEmailSignIn(auth, email, password);
    } catch (error) {
      console.error('Login failed:', error);
      // The useUser hook will handle displaying the error in a toast
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="mb-8 flex items-center gap-3 text-center">
            <HeartPulse className="h-12 w-12 text-primary" />
            <h1 className="font-headline text-5xl font-bold text-primary">
            VitalSync
            </h1>
        </div>
      <div className="w-full max-w-sm">
        <AuthForm mode="login" onSubmit={handleLogin} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
