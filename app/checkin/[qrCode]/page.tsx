'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  CalendarDays,
  MapPin,
  QrCode,
  AlertTriangle,
  Leaf,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusPill } from '@/components/patterns/StatusPill'
import { apiGet, apiPost } from '@/lib/api'
import { formatEventDate } from '@/lib/format'

/**
 * Deliberately outside the (app) route group and outside AuthGuard: this URL
 * is opened by scanning a printed QR code, often by someone who is not signed
 * in yet, so it handles its own auth redirect and carries `redirect=` back.
 *
 * Previously this rendered the desktop public Navbar — a hide-on-scroll bar
 * with no mobile menu — on what is fundamentally a phone-in-the-field screen.
 * It now has its own minimal, centred layout.
 */

interface CheckInData {
  event: { id: string; title: string; location: string; date: string }
  isRegistered: boolean
  alreadyCheckedIn: boolean
}

type Status = 'loading' | 'ready' | 'checking-in' | 'success' | 'error'

function CheckInBody({ qrCode }: { qrCode: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('loading')
  const [data, setData] = useState<CheckInData | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [awarded, setAwarded] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push(`/login?redirect=/checkin/${qrCode}`)
      return
    }

    apiGet<CheckInData>(`/api/checkin/${qrCode}`)
      .then((body) => {
        setData(body)
        setStatus('ready')
      })
      .catch((err: Error) => {
        setErrorMessage(err.message || 'Could not load this check-in link')
        setStatus('error')
      })
  }, [qrCode, router])

  const handleCheckIn = async () => {
    setStatus('checking-in')
    setErrorMessage('')
    try {
      const body = await apiPost<{ tokensAwarded?: number }>(`/api/checkin/${qrCode}`)
      setAwarded(body.tokensAwarded ?? null)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Check-in failed')
      setStatus('ready')
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 items-center justify-center border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={22} height={22} className="size-[22px] object-contain" />
          <span className="text-h4 tracking-tight text-primary-700">Sproutify</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-5">
        <Card className="w-full max-w-sm p-6 text-center">
          {status === 'loading' && (
            <div className="space-y-3">
              <Skeleton className="mx-auto h-10 w-10 rounded-full" />
              <Skeleton className="mx-auto h-6 w-3/4" />
              <Skeleton className="mx-auto h-4 w-1/2" />
            </div>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive-subtle text-destructive">
                <AlertTriangle size={20} strokeWidth={1.75} />
              </div>
              <h1 className="mt-4 text-h3 text-foreground">Check-in unavailable</h1>
              <p className="mt-2 text-body-sm text-muted-foreground">{errorMessage}</p>
              <Button asChild variant="secondary" className="mt-6 w-full">
                <Link href="/volunteer/events">Browse events</Link>
              </Button>
            </>
          )}

          {(status === 'ready' || status === 'checking-in') && data && (
            <>
              <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                <QrCode size={20} strokeWidth={1.75} />
              </div>
              <h1 className="mt-4 text-h3 text-foreground">{data.event.title}</h1>

              <div className="mt-3 space-y-1.5 text-body-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-1.5">
                  <CalendarDays size={14} strokeWidth={1.75} />
                  {formatEventDate(data.event.date)}
                </p>
                <p className="flex items-center justify-center gap-1.5">
                  <MapPin size={14} strokeWidth={1.75} />
                  {data.event.location}
                </p>
              </div>

              {errorMessage && (
                <p className="mt-4 rounded-md border border-destructive/20 bg-destructive-subtle p-3 text-body-sm text-destructive">
                  {errorMessage}
                </p>
              )}

              <div className="mt-6">
                {!data.isRegistered ? (
                  <>
                    <div className="rounded-md border border-warning/30 bg-warning-subtle p-3 text-body-sm text-foreground">
                      You are not registered for this event yet.
                    </div>
                    <Button asChild className="mt-4 w-full" size="lg">
                      <Link href={`/volunteer/events/${data.event.id}`}>
                        View event and register
                      </Link>
                    </Button>
                  </>
                ) : data.alreadyCheckedIn ? (
                  <StatusPill tone="success" className="mx-auto">
                    <CheckCircle2 size={13} strokeWidth={2} />
                    Already checked in
                  </StatusPill>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={status === 'checking-in'}
                    onClick={handleCheckIn}
                  >
                    {status === 'checking-in' ? 'Checking in…' : 'Check in'}
                  </Button>
                )}
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-subtle text-success">
                <CheckCircle2 size={28} strokeWidth={1.75} />
              </div>
              <h1 className="mt-4 text-h2 text-foreground">You are checked in</h1>
              {awarded != null && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-3 py-1.5">
                  <Leaf size={15} strokeWidth={1.75} className="text-primary-700" />
                  <span className="tnum text-body font-medium text-primary-800">
                    +{awarded} EcoTokens
                  </span>
                </div>
              )}
              <p className="mt-3 text-body-sm text-muted-foreground">
                Thanks for turning up — enjoy the day.
              </p>
              <Button asChild className="mt-6 w-full" size="lg">
                <Link href="/volunteer/dashboard">Go to dashboard</Link>
              </Button>
            </>
          )}
        </Card>
      </main>
    </div>
  )
}

export default function CheckInPage({ params }: { params: Promise<{ qrCode: string }> }) {
  const { qrCode } = use(params)
  return <CheckInBody qrCode={qrCode} />
}
