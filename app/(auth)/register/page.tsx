'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiPost } from '@/lib/api'

/**
 * Note: no role selector. Self-service admin signup was removed earlier —
 * the API forces role VOLUNTEER regardless of what the client sends, and
 * admins are promoted by an existing admin.
 *
 * Also fixes `width: '100vw'` on the old page, which caused horizontal
 * scroll whenever a scrollbar was present.
 */
export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
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

    setLoading(true)
    try {
      await apiPost(
        '/api/auth/register',
        { name: form.name, email: form.email, password: form.password },
        false
      )
      router.push('/login?message=Account created — please sign in.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md p-6 md:p-8">
      <h1 className="text-h1 text-foreground">Create your account</h1>
      <p className="mt-1.5 text-body text-muted-foreground">
        Register for events, track your impact and earn EcoTokens.
      </p>

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

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
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
