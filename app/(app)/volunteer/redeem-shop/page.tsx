'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Leaf, Gift, PackageX } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatusPill } from '@/components/patterns/StatusPill'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { apiGet, apiPost } from '@/lib/api'
import { formatNumber } from '@/lib/format'

interface Reward {
  id: string
  name: string
  description: string | null
  cost: number
  imageUrl: string | null
  stock: number | null
}

/**
 * The reward CardMedia was the one correctly-working image slot in the old
 * app (200px tall, object-contain, backed by 1152x896 PNGs). That behaviour
 * is preserved exactly — only the surrounding chrome changed.
 *
 * The insufficient-balance state now disables the button with an explanatory
 * tooltip rather than silently greying it out.
 */
function RedeemBody() {
  const queryClient = useQueryClient()
  const [pending, setPending] = useState<Reward | null>(null)

  const balanceQuery = useQuery({
    queryKey: ['volunteer-dashboard'],
    queryFn: () => apiGet<{ ecoTokens: number }>('/api/volunteer/dashboard'),
  })

  const rewardsQuery = useQuery({
    queryKey: ['volunteer-rewards'],
    queryFn: () => apiGet<Reward[]>('/api/volunteer/rewards'),
  })

  const redeem = useMutation({
    mutationFn: (rewardId: string) => apiPost('/api/volunteer/redeem', { rewardId }),
    onSuccess: (res: unknown) => {
      const message = (res as { message?: string })?.message
      toast.success(message || 'Reward redeemed')
      queryClient.invalidateQueries({ queryKey: ['volunteer-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['volunteer-rewards'] })
    },
    onError: (e: Error) => toast.error(e.message || 'Could not redeem this reward'),
    onSettled: () => setPending(null),
  })

  const balance = balanceQuery.data?.ecoTokens ?? 0
  const rewards = rewardsQuery.data ?? []

  return (
    <TooltipProvider>
      <PageHeader
        eyebrow="Rewards"
        title="EcoToken shop"
        description="Trade the tokens you have earned for something useful."
        actions={
          <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
            <Leaf size={16} strokeWidth={1.75} className="text-primary-700" />
            <span className="tnum text-body font-medium text-foreground">
              {balanceQuery.isLoading ? '-' : formatNumber(balance)}
            </span>
            <span className="text-body-sm text-muted-foreground">available</span>
          </div>
        }
      />

      <div className="mt-8">
        {rewardsQuery.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[380px] rounded-lg" />
            ))}
          </div>
        ) : rewardsQuery.isError ? (
          <EmptyState
            icon={PackageX}
            title="Couldn't load rewards"
            action={
              <Button variant="secondary" onClick={() => rewardsQuery.refetch()}>
                Try again
              </Button>
            }
          />
        ) : rewards.length === 0 ? (
          <EmptyState
            icon={Gift}
            title="No rewards available right now"
            description="New items get added as partners come on board. Check back soon."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => {
              const affordable = balance >= reward.cost
              const short = reward.cost - balance

              return (
                <Card key={reward.id} className="flex flex-col overflow-hidden">
                  <div className="flex h-[200px] items-center justify-center border-b border-border bg-surface-sunken p-4">
                    {reward.imageUrl ? (
                      <Image
                        src={reward.imageUrl}
                        alt={reward.name}
                        width={1152}
                        height={896}
                        className="h-full w-auto object-contain"
                      />
                    ) : (
                      <Gift size={36} strokeWidth={1.5} className="text-primary-300" />
                    )}
                  </div>

                  <CardContent className="flex flex-1 flex-col p-5">
                    <h2 className="text-h4 text-foreground">{reward.name}</h2>
                    {reward.description && (
                      <p className="mt-1.5 flex-1 text-body-sm text-muted-foreground">
                        {reward.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <StatusPill tone="primary">
                        <Leaf size={13} strokeWidth={2} />
                        {reward.cost} tokens
                      </StatusPill>
                      {reward.stock != null && reward.stock <= 5 && (
                        <StatusPill tone="warning">{reward.stock} left</StatusPill>
                      )}
                    </div>

                    <div className="mt-5">
                      {affordable ? (
                        <Button className="w-full" onClick={() => setPending(reward)}>
                          Redeem
                        </Button>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block">
                              <Button className="w-full" disabled>
                                Not enough tokens
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {short} more {short === 1 ? 'token' : 'tokens'} needed. Attend an
                            event to earn more.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <p className="mt-8 text-body-sm text-muted-foreground">
        Tokens are earned by checking in at events.{' '}
        <Link
          href="/volunteer/events"
          className="text-primary underline-offset-4 hover:underline"
        >
          Find one near you
        </Link>
        .
      </p>

      <AlertDialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redeem {pending?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will spend{' '}
              <span className="font-medium text-foreground">{pending?.cost} EcoTokens</span>,
              leaving you with {balance - (pending?.cost ?? 0)}. We will be in touch about
              getting it to you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={redeem.isPending}>Not yet</AlertDialogCancel>
            <AlertDialogAction
              disabled={redeem.isPending}
              onClick={(e) => {
                e.preventDefault()
                if (pending) redeem.mutate(pending.id)
              }}
            >
              {redeem.isPending ? 'Redeeming…' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}

export default function RedeemShopPage() {
  return (
    <AuthGuard requiredRole="VOLUNTEER">
      <RedeemBody />
    </AuthGuard>
  )
}
