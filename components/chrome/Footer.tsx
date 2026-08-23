import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/patterns/Container'

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
    <footer className="border-t border-border bg-primary-900 text-primary-100">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt=""
                width={26}
                height={26}
                className="size-[26px] object-contain"
              />
              <span className="text-h4 tracking-tight text-background">Sproutify</span>
            </div>
            <p className="mt-3 max-w-sm text-body-sm text-primary-200">
              Connecting volunteers with organised environmental action: beach cleanups,
              tree plantations and community-led restoration.
            </p>
          </div>

          <div>
            <h2 className="text-overline uppercase text-primary-300">Navigate</h2>
            <ul className="mt-3 space-y-2">
              {NAVIGATE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-primary-100 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-overline uppercase text-primary-300">Get involved</h2>
            <ul className="mt-3 space-y-2">
              {ENGAGE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-primary-100 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-800 pt-6">
          <p className="text-caption text-primary-300">
            © {new Date().getFullYear()} Sproutify. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
