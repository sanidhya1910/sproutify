'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Container } from '@/components/patterns/Container'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
]

/**
 * Replaces the old MUI AppBar, which had two serious defects:
 *
 * 1. It hardcoded `color: trigger ? '#333' : '#fff'` — i.e. white text until
 *    you scrolled — on the assumption that every page has a dark hero. Only
 *    the homepage and login do, so on /about, /resources, /contact and
 *    /events the nav links AND the wordmark rendered white-on-white and were
 *    completely invisible until scroll.
 * 2. It had no mobile treatment at all: the flex row simply overflowed
 *    off-screen, clipping the logo and forcing horizontal page scroll.
 *
 * The bar is now always opaque, so contrast never depends on what's behind
 * it, and the wordmark is left-aligned (centre-branding is what pushed the
 * links into it in the first place).
 */

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

export default function Navbar() {
  const scrolled = useScrolled()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-16 border-b bg-background/85 backdrop-blur-md transition-colors',
        scrolled ? 'border-border shadow-sm' : 'border-transparent'
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/logo.png" alt="" width={28} height={28} className="size-7 object-contain" />
          <span className="text-h4 tracking-tight text-primary-700">Sproutify</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-body transition-colors',
                  active
                    ? 'text-primary-800 font-medium'
                    : 'text-muted-foreground hover:bg-surface-sunken hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Get started</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu strokeWidth={1.75} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex h-16 items-center gap-2 border-b border-border px-5">
              <Image src="/logo.png" alt="" width={24} height={24} className="size-6 object-contain" />
              <span className="text-h4 tracking-tight text-primary-700">Sproutify</span>
            </div>
            <nav className="flex flex-col p-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-3 text-body-lg transition-colors',
                    pathname === link.href
                      ? 'bg-primary-50 font-medium text-primary-800'
                      : 'text-foreground hover:bg-surface-sunken'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 flex flex-col gap-2 border-t border-border p-5">
              <Button asChild variant="secondary" size="lg">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/register">Get started</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  )
}
