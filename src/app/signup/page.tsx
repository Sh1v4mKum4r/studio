
'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { useAuth, useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignup = async ({ email, password, name }: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      if (newUser) {
        const userProfileRef = doc(firestore, 'users', newUser.uid);
        setDocumentNonBlocking(
          userProfileRef,
          {
            id: newUser.uid,
            email: newUser.email,
            name: name,
            userType: 'patient',
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error('Signup failed:', error);
      // Errors will be handled by the global error listener
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
            <AuthForm mode="signup" onSubmit={handleSignup} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
            </Link>
            </p>
        </div>
    </div>
  );
}
