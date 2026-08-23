import Link from 'next/link'
import { Compass } from 'lucide-react'
import Navbar from '@/components/chrome/Navbar'
import Footer from '@/components/chrome/Footer'
import { Container } from '@/components/patterns/Container'
import { EmptyState } from '@/components/patterns/EmptyState'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center">
        <Container className="py-16">
          <div className="mx-auto max-w-lg">
            <EmptyState
              icon={Compass}
              title="This page has wandered off the trail"
              description="The page you're looking for doesn't exist, or may have moved."
              action={
                <div className="flex gap-3">
                  <Button asChild variant="secondary">
                    <Link href="/events">Browse events</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/">Go home</Link>
                  </Button>
                </div>
              }
            />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
