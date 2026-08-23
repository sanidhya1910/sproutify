'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import Navbar from '@/components/chrome/Navbar'
import { Container } from '@/components/patterns/Container'
import { EmptyState } from '@/components/patterns/EmptyState'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center">
        <Container className="py-16">
          <div className="mx-auto max-w-lg">
            <EmptyState
              icon={AlertTriangle}
              title="Something went wrong"
              description="An unexpected error occurred. You can try again, or head back home."
              action={
                <div className="flex gap-3">
                  <Button asChild variant="secondary">
                    <Link href="/">Go home</Link>
                  </Button>
                  <Button onClick={() => reset()}>Try again</Button>
                </div>
              }
            />
          </div>
        </Container>
      </main>
    </div>
  )
}
