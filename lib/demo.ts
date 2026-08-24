/**
 * Demo-mode configuration.
 *
 * This build is a portfolio showcase, so the sign-in screen advertises its own
 * credentials and registration deliberately does NOT create a database row.
 *
 * Everything here is intentionally public. The accounts below exist only in
 * the seeded demo database and hold no real personal data. Do not reuse this
 * module, or the shared password, in an environment with real users.
 */

export const DEMO_MODE = true

/** Shared password for every seeded demo account. */
export const DEMO_PASSWORD = 'TestPassword123'

export interface DemoAccount {
  label: string
  role: 'Admin' | 'Volunteer' | 'Host'
  email: string
  password: string
  blurb: string
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Volunteer',
    role: 'Volunteer',
    email: 'sanidhya.ravi@example.com',
    password: DEMO_PASSWORD,
    blurb: 'Four events attended, 80 EcoTokens, two upcoming signups.',
  },
  {
    label: 'Host',
    role: 'Host',
    email: 'host@example.com',
    password: DEMO_PASSWORD,
    blurb: 'Mumbai Beach Warriors — hosts and manages its own events.',
  },
  {
    label: 'Admin',
    role: 'Admin',
    email: 'admin@sproutify.local',
    password: DEMO_PASSWORD,
    blurb: 'Full event, volunteer and message management.',
  },
]

/**
 * Registration in demo mode writes here instead of to the database, so a
 * visitor can complete the signup flow without polluting the seeded dataset.
 */
const LOCAL_ACCOUNT_KEY = 'sproutify.demo.account'

export interface LocalAccount {
  name: string
  email: string
  createdAt: string
  /**
   * Which seeded account this local profile borrows its session from.
   *
   * A browser-only account has no database row, so it cannot be issued its own
   * JWT and every authenticated endpoint would reject it. Registration signs
   * the visitor into the demo volunteer instead, and the app shell shows the
   * name they registered with only while that specific session is active.
   */
  backedBy: string
}

/** The seeded account that browser-only volunteer registrations borrow a session from. */
export const DEMO_VOLUNTEER = DEMO_ACCOUNTS.find((a) => a.role === 'Volunteer')!

/** The seeded account that browser-only host registrations borrow a session from. */
export const DEMO_HOST = DEMO_ACCOUNTS.find((a) => a.role === 'Host')!

export function saveLocalAccount(account: LocalAccount) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCAL_ACCOUNT_KEY, JSON.stringify(account))
}

export function readLocalAccount(): LocalAccount | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(LOCAL_ACCOUNT_KEY)
    return raw ? (JSON.parse(raw) as LocalAccount) : null
  } catch {
    return null
  }
}

export function clearLocalAccount() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(LOCAL_ACCOUNT_KEY)
}
