'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Info, HeartHandshake, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiPost } from '@/lib/api'
import { DEMO_MODE, DEMO_VOLUNTEER, DEMO_HOST, saveLocalAccount } from '@/lib/demo'
import { cn } from '@/lib/utils'

type AccountKind = 'volunteer' | 'host'

/**
 * Two account kinds: a volunteer joins events, a host (an NGO or community
 * group) creates and manages them. Real self-service admin signup was
 * removed earlier — the API forces role VOLUNTEER regardless of what the
 * client sends — so in demo mode the toggle picks which seeded demo account
 * the browser-only profile borrows a session from, rather than which role
 * gets written to the database. See lib/demo.ts.
 *
 * Also fixes `width: '100vw'` on the old page, which caused horizontal
 * scroll whenever a scrollbar was present.
 */
export default function RegisterPage() {
  const router = useRouter()
  const [kind, setKind] = useState<AccountKind>('volunteer')
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    if (kind === 'host' && !form.organization.trim()) {
      setError('Organisation name is required for a host account')
      return
    }

    setLoading(true)
    try {
      if (DEMO_MODE) {
        // Demo build: the profile is kept in browser storage and no database
        // row is created, so visitors can complete signup without adding to
        // the seeded dataset. The session itself is borrowed from whichever
        // demo account matches the chosen account kind, because a
        // browser-only account has no row to issue a token against and every
        // authenticated endpoint would reject it.
        const backing = kind === 'host' ? DEMO_HOST : DEMO_VOLUNTEER

        saveLocalAccount({
          name: kind === 'host' ? form.organization : form.name,
          email: form.email,
          createdAt: new Date().toISOString(),
          backedBy: backing.email,
        })

        const data = await apiPost<{ token: string }>(
          '/api/auth/login',
          { email: backing.email, password: backing.password },
          false
        )
        localStorage.setItem('token', data.token)
        router.push(kind === 'host' ? '/admin/dashboard' : '/volunteer/dashboard')
        return
      }

      await apiPost(
        '/api/auth/register',
        { name: form.name, email: form.email, password: form.password },
        false
      )
      router.push('/login?message=Account created. Please sign in.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 bg-transparent p-0 shadow-none">
      <h1 className="font-display text-[2.1rem] leading-[0.95] text-foreground">
        Create your account
      </h1>
      <p className="mt-1.5 text-body text-muted-foreground">
        {kind === 'host'
          ? 'Host events with your organisation and manage your own volunteers.'
          : 'Register for events, track your impact and earn EcoTokens.'}
      </p>

      {/* Account kind toggle */}
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface-sunken p-1">
        <button
          type="button"
          onClick={() => setKind('volunteer')}
          className={cn(
            'flex items-center justify-center gap-2 rounded-md px-3 py-2 text-body-sm font-medium transition-colors',
            kind === 'volunteer'
              ? 'bg-surface text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={kind === 'volunteer'}
        >
          <HeartHandshake size={16} strokeWidth={1.75} />
          Volunteer
        </button>
        <button
          type="button"
          onClick={() => setKind('host')}
          className={cn(
            'flex items-center justify-center gap-2 rounded-md px-3 py-2 text-body-sm font-medium transition-colors',
            kind === 'host'
              ? 'bg-surface text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={kind === 'host'}
        >
          <Building2 size={16} strokeWidth={1.75} />
          Host / NGO
        </button>
      </div>

      {DEMO_MODE && (
        <div className="mt-5 flex items-start gap-2.5 rounded-md border border-border bg-surface-sunken p-3">
          <Info size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary-600" />
          <p className="text-body-sm text-muted-foreground">
            Demo build: your details stay in this browser and no account is created on the
            server. You will be signed in with a sample {kind === 'host' ? 'host' : 'volunteer'}{' '}
            account so you can look around.
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-md border border-destructive/20 bg-destructive-subtle p-3 text-body-sm text-destructive"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {kind === 'host' ? (
          <div>
            <Label htmlFor="organization">Organisation name</Label>
            <Input
              id="organization"
              autoComplete="organization"
              required
              value={form.organization}
              onChange={update('organization')}
              placeholder="e.g. Mumbai Beach Warriors"
              className="mt-1.5"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              autoComplete="name"
              required
              value={form.name}
              onChange={update('name')}
              className="mt-1.5"
            />
          </div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={update('email')}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={form.password}
              onChange={update('password')}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? (
                <EyeOff size={16} strokeWidth={1.75} />
              ) : (
                <Eye size={16} strokeWidth={1.75} />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-caption text-muted-foreground">At least 6 characters.</p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            className="mt-1.5"
          />
        </div>

        <Button type="submit" size="lg" className="h-12 w-full rounded-full bg-stamp font-semibold text-white hover:bg-stamp-ink" disabled={loading}>
          {loading
            ? 'Creating account…'
            : kind === 'host'
              ? 'Create host account'
              : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-body-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  )
}
