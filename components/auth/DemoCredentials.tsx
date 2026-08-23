'use client'

import { KeyRound } from 'lucide-react'
import { DEMO_ACCOUNTS, type DemoAccount } from '@/lib/demo'
import { StatusPill } from '@/components/patterns/StatusPill'

/**
 * Surfaces the demo credentials on the sign-in screen itself.
 *
 * A portfolio reviewer should not have to hunt through a README to get past
 * the login wall, so each account is one click to fill. The accounts are
 * seeded fixtures with no real data behind them.
 */
export function DemoCredentials({
  onPick,
}: {
  onPick: (account: DemoAccount) => void
}) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-surface-sunken p-4">
      <div className="flex items-center gap-2">
        <KeyRound size={15} strokeWidth={1.75} className="text-primary-600" />
        <p className="text-label font-medium text-foreground">Demo accounts</p>
      </div>
      <p className="mt-1 text-body-sm text-muted-foreground">
        This is a demo build. Pick an account to fill the form.
      </p>

      <ul className="mt-3 space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <li key={account.email}>
            <button
              type="button"
              onClick={() => onPick(account)}
              className="w-full rounded-md border border-border bg-surface p-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-foreground">{account.email}</span>
                <StatusPill tone={account.role === 'Admin' ? 'primary' : 'neutral'}>
                  {account.label}
                </StatusPill>
              </span>
              <span className="mt-1 block text-caption text-muted-foreground">
                {account.blurb}
              </span>
              <span className="mt-1.5 block font-mono text-caption text-subtle-foreground">
                {account.password}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
