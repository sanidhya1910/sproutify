'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiPost } from '@/lib/api'
import { DemoCredentials } from '@/components/auth/DemoCredentials'
import { DEMO_MODE, type DemoAccount } from '@/lib/demo'

interface LoginResponse {
  token: string
  user: { role: string; name?: string }
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // /register redirects here with ?message=Registration successful, and the
  // previous page never read it — so the only confirmation a new user got
  // was silently dropped.
  const notice = searchParams.get('message')
  const redirect = searchParams.get('redirect')

  const signIn = async (nextEmail: string, nextPassword: string) => {
    setError('')
    setLoading(true)

    try {
      const data = await apiPost<LoginResponse>(
        '/api/auth/login',
        { email: nextEmail, password: nextPassword },
        false
      )
      localStorage.setItem('token', data.token)

      if (redirect && redirect.startsWith('/')) {
        router.push(redirect)
      } else if (data.user.role === 'ADMIN' || data.user.role === 'ORGANIZER') {
        router.push('/admin/dashboard')
      } else {
        router.push('/volunteer/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void signIn(email, password)
  }

  // One click fills the form and signs straight in: a reviewer landing on the
  // login wall should not have to type anything to see the product.
  const pickDemoAccount = (account: DemoAccount) => {
    setEmail(account.email)
    setPassword(account.password)
    void signIn(account.email, account.password)
  }

  return (
    <Card className="w-full max-w-md border-0 bg-transparent p-0 shadow-none">
      <h1 className="font-display text-[2.1rem] leading-[0.95] text-foreground">
        Welcome back
      </h1>
      <p className="mt-1.5 text-body text-muted-foreground">
        Sign in to manage your events and EcoTokens.
      </p>

      {notice && (
        <div className="mt-5 flex items-start gap-2.5 rounded-md border border-success/20 bg-success-subtle p-3">
          <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-success" />
          <p className="text-body-sm text-foreground">{notice}</p>
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
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <Button type="submit" size="lg" className="h-12 w-full rounded-full bg-stamp font-semibold text-white hover:bg-stamp-ink" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {DEMO_MODE && <DemoCredentials onPick={pickDemoAccount} />}

      <p className="mt-6 text-center text-body-sm text-muted-foreground">
        New to Sproutify?{' '}
        <Link href="/register" className="text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Card className="h-[460px] w-full max-w-md animate-pulse" />}>
      <LoginForm />
    </Suspense>
  )
}
