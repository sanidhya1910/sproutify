import Link from 'next/link'
import { Container } from '@/components/patterns/Container'
import { Stamp } from '@/components/passport/Stamp'
import { IconPassport } from '@/components/passport/icons'

/**
 * Rebuilt from the old MUI footer, which used `bgcolor: '#1C1C1C'` (a value
 * unrelated to the palette), `fontFamily: Georgia, serif` (a face declared
 * nowhere in the theme and used only here plus the homepage), and four social
 * IconButtons all pointing at `href="#"`.
 *
 * Those dead social links are deliberately NOT reproduced. Four links that go
 * nowhere is worse than none; they can be added back when real accounts exist.
 */

const NAVIGATE = [
  { href: '/about', label: 'About us' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
]

const ENGAGE = [
  { href: '/resources', label: 'Resources' },
  { href: '/register', label: 'Become a volunteer' },
  { href: '/login', label: 'Log in' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary-900 text-primary-100">
      {/* Perforated tear-off edge */}
      <div
        aria-hidden
        className="h-3 bg-[radial-gradient(circle_at_10px_0,hsl(var(--background))_6px,transparent_6.5px)] bg-[length:20px_12px] bg-repeat-x"
      />
      <Container className="pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.6fr))]">
          <div className="flex items-start gap-6">
            <div className="hidden w-[112px] shrink-0 sm:block">
              <Stamp top="Sproutify · Mumbai" bottom="Est. 2020" icon={IconPassport} ink="paper" rotate={-8} fluid seed={21} />
            </div>
            <div>
              <p className="max-w-sm font-display text-statement text-background">Leave it cleaner than you found it.</p>
              <p className="mt-4 max-w-sm text-body text-primary-200">
                Volunteer-run cleanups, plantations and e-waste drives across Mumbai.
              </p>
            </div>
          </div>

          <nav aria-labelledby="footer-navigate">
            <h2 id="footer-navigate" className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary-300">
              Navigate
            </h2>
            <ul className="mt-4 space-y-3">
              {NAVIGATE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body font-medium text-primary-100 underline-offset-4 transition-colors hover:text-background hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-engage">
            <h2 id="footer-engage" className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary-300">
              Get involved
            </h2>
            <ul className="mt-4 space-y-3">
              {ENGAGE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body font-medium text-primary-100 underline-offset-4 transition-colors hover:text-background hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t-2 border-dashed border-primary-700 pt-6 font-mono text-[0.72rem] text-primary-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sproutify</p>
          <p>19.07° N, 72.87° E</p>
        </div>
      </Container>

      {/* Oversized wordmark, cropped by the bottom edge. Decorative: the
          brand name is already announced by the navbar. */}
      <p
        aria-hidden
        className="pointer-events-none mt-8 select-none whitespace-nowrap text-center font-display text-[clamp(3rem,12.6vw,12.5rem)] leading-[0.74] text-primary-800"
      >
        Sproutify
      </p>
    </footer>
  )
}
