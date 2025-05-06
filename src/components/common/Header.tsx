import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          EmployeePass
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/admin">
              <KeyRound className="mr-2 h-4 w-4" /> Admin
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
