'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Gift,
  Users,
  Mail,
  Menu,
  LogOut,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusPill } from '@/components/patterns/StatusPill'
import { useDisplayName } from '@/lib/use-display-name'
import { cn } from '@/lib/utils'

/**
 * Replaces components/chrome/navigation.jsx (257 lines of MUI).
 *
 * Fixes carried over from the audit:
 *  - Role chips were #f44336 red / #2196f3 blue — both off-brand, and red now
 *    means danger only. They use semantic StatusPill tones instead.
 *  - The hover shadow was rgba(0,191,165,…), a teal from a long-dead palette.
 *  - The user menu linked to /profile, a route that does not exist.
 *  - /volunteer/redeem-shop was missing from the nav entirely — it was only
 *    reachable via a card on the dashboard.
 *  - /admin/analytics was linked but 404s, so it is not included.
 *  - Desktop and mobile duplicated the whole nav item markup; both now render
 *    from one NAV_ITEMS array through one NavItem component.
 *
 * Auth is hand-rolled JWT in localStorage (NOT next-auth); the decode below
 * mirrors components/auth/auth-guard.jsx and is display-only.
 */

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const VOLUNTEER_NAV: NavItem[] = [
  { href: '/volunteer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/volunteer/events', label: 'Browse events', icon: CalendarDays },
  { href: '/volunteer/my-events', label: 'My events', icon: CalendarCheck },
  { href: '/volunteer/redeem-shop', label: 'Redeem shop', icon: Gift },
]

const ADMIN_NAV: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
  { href: '/admin/volunteers', label: 'Volunteers', icon: Users },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
]

interface SessionUser {
  name?: string
  email?: string
  role?: string
}

function useSessionUser(): SessionUser | null {
  const [user, setUser] = useState<SessionUser | null>(null)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      setUser(JSON.parse(atob(token.split('.')[1])))
    } catch {
      // Malformed token: AuthGuard handles the redirect; nothing to show here.
    }
  }, [])
  return user
}

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname()
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'relative flex h-9 items-center gap-2.5 rounded-md px-3 text-body transition-colors',
        active
          ? 'bg-primary-50 font-medium text-primary-800'
          : 'text-muted-foreground hover:bg-surface-sunken hover:text-foreground'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <Icon size={18} strokeWidth={1.75} />
      {item.label}
    </Link>
  )
}

function initials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function UserMenu({ user }: { user: SessionUser | null }) {
  const router = useRouter()
  const isAdmin = user?.role === 'ADMIN'
  const displayName = useDisplayName(user?.name)

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-800">
            {initials(displayName)}
          </span>
          <span className="hidden text-body text-foreground sm:inline">{displayName ?? 'Account'}</span>
          <ChevronDown size={16} className="text-muted-foreground" strokeWidth={1.75} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="text-body font-medium text-foreground">{displayName ?? 'Signed in'}</p>
          {user?.email && (
            <p className="truncate text-body-sm text-muted-foreground">{user.email}</p>
          )}
          <div className="mt-2">
            <StatusPill tone={isAdmin ? 'primary' : 'neutral'}>
              {isAdmin ? 'Admin' : 'Volunteer'}
            </StatusPill>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
          <LogOut size={16} strokeWidth={1.75} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const user = useSessionUser()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const items = user?.role === 'ADMIN' ? ADMIN_NAV : VOLUNTEER_NAV

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const brand = (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo.png" alt="" width={26} height={26} className="size-[26px] object-contain" />
      <span className="text-h4 tracking-tight text-primary-700">Sproutify</span>
    </Link>
  )

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">{brand}</div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {items.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-5 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu strokeWidth={1.75} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex h-16 items-center border-b border-border px-5">{brand}</div>
                <nav className="flex flex-col gap-1 p-3">
                  {items.map((item) => (
                    <NavLink key={item.href} item={item} onNavigate={() => setOpen(false)} />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="lg:hidden">{brand}</div>
          </div>
          <div className="hidden lg:block" />
          <UserMenu user={user} />
        </header>

        <main className="px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}
