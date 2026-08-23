import Link from 'next/link'
import { Lock } from 'lucide-react'
import { EmptyState } from '@/components/patterns/EmptyState'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Access denied' }

export default function UnauthorizedPage() {
  return (
    <div className="w-full max-w-md">
      <EmptyState
        icon={Lock}
        title="Access denied"
        description="You don't have permission to view that page. If you think this is a mistake, sign in with the correct account."
        action={
          <div className="flex gap-3">
            <Button asChild variant="secondary">
              <Link href="/">Go home</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        }
      />
    </div>
  )
}
