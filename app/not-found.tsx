import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/chrome/Navbar'
import Footer from '@/components/chrome/Footer'
import { Container } from '@/components/patterns/Container'
import { Button } from '@/components/ui/button'
import { Stamp } from '@/components/passport/Stamp'
import { IconPin } from '@/components/passport/icons'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center">
        <Container className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="font-mono text-sm font-semibold text-stamp-ink">Error 404</p>
            <h1 className="mt-5 font-display text-hero">
              This page isn’t
              <span className="block text-stamp">on the map.</span>
            </h1>
            <p className="mt-8 max-w-xl text-body-lg text-muted-foreground">
              The page you’re looking for doesn’t exist, or may have moved.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-stamp px-6 text-white hover:bg-stamp-ink">
                <Link href="/events">
                  Browse events
                  <ArrowRight strokeWidth={2.25} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="h-12 rounded-full px-6">
                <Link href="/">Go home</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-[220px] lg:w-[280px]">
            <Stamp top="No entry" bottom="Page not found" icon={IconPin} ink="orange" rotate={-12} fluid animate seed={17} />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
