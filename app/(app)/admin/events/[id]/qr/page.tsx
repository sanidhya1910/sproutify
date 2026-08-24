'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Download, Printer, QrCode } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { EmptyState } from '@/components/patterns/EmptyState'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiGet } from '@/lib/api'
import { generateQRCode } from '@/lib/qr-utils'
import { formatEventDate } from '@/lib/format'

interface EventWithQr {
  id: string
  title: string
  date: string
  location: string | null
  qrCode: string
}

function QrBody({ id }: { id: string }) {
  const [qrImage, setQrImage] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-event-qr', id],
    queryFn: () => apiGet<EventWithQr>(`/api/admin/events/${id}`),
  })

  useEffect(() => {
    if (!data?.qrCode) return
    generateQRCode(data.qrCode).then((img: string | null) => setQrImage(img ?? null))
  }, [data?.qrCode])

  if (isLoading) {
    return <Skeleton className="mx-auto h-[520px] max-w-md rounded-lg" />
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={QrCode}
        title="Couldn't load this event"
        action={
          <Button variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  const checkInUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/checkin/${data.qrCode}`

  const handleDownload = () => {
    if (!qrImage) return
    const link = document.createElement('a')
    link.href = qrImage
    link.download = `${data.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-checkin-qr.png`
    link.click()
  }

  return (
    <>
      <div className="print:hidden">
        <Link
          href={`/admin/events/${id}`}
          className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Back to event
        </Link>
      </div>

      <div className="mx-auto mt-6 max-w-md print:mt-0">
        <Card className="p-8 text-center print:border-0">
          <h1 className="text-h2 text-foreground">{data.title}</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            {formatEventDate(data.date)}
            {data.location && ` · ${data.location}`}
          </p>

          <div className="mt-6 flex justify-center">
            {qrImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrImage}
                alt={`Check-in QR code for ${data.title}`}
                width={280}
                height={280}
                className="rounded-md border border-border"
              />
            ) : (
              <Skeleton className="size-[280px] rounded-md" />
            )}
          </div>

          <p className="mt-4 break-all text-caption text-subtle-foreground">{checkInUrl}</p>

          <p className="mt-4 text-body-sm text-muted-foreground">
            Scan to check in. Volunteers must be signed in and registered.
          </p>

          <div className="mt-6 flex justify-center gap-3 print:hidden">
            <Button variant="secondary" onClick={handleDownload} disabled={!qrImage}>
              <Download strokeWidth={1.75} />
              Download
            </Button>
            <Button onClick={() => window.print()}>
              <Printer strokeWidth={1.75} />
              Print
            </Button>
          </div>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: #fff;
          }
          aside,
          header {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default function EventQrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <AuthGuard requiredRole={['ADMIN', 'ORGANIZER']}>
      <QrBody id={id} />
    </AuthGuard>
  )
}
