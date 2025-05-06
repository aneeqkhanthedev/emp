import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-3xl font-bold mb-2">Employee Not Found</h2>
        <p className="text-muted-foreground mb-6">Sorry, we couldn't find the employee you were looking for.</p>
        <Button asChild>
            <Link href="/admin">Return to Admin Panel</Link>
        </Button>
    </div>
  )
}
