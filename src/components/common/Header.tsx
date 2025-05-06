'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { KeyRound, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  console.log(user, 'useruser')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push('/signin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      router.push('/signin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user) {
    return null; // Middleware will handle redirect, but this prevents flash of content
  }

  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Atria Employee Verification
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/admin">
              <KeyRound className="mr-2 h-4 w-4" /> Admin
            </Link>
          </Button>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
