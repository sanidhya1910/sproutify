"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navigation from '@/components/ui/navigation'
import AuthGuard from '@/components/ui/auth-guard'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import Link from 'next/link'
import { generateQRCode } from '@/lib/qr-utils'

export default function EventQrPage() {
  const params = useParams()
  const [event, setEvent] = useState(null)
  const [qrImage, setQrImage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!params.id) return

    const load = async () => {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/admin/events/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error('Could not load event')
        const data = await response.json()
        setEvent(data)

        const image = await generateQRCode(data.qrCode)
        if (!image) throw new Error('Could not generate QR code')
        setQrImage(image)
      } catch (error) {
        console.error('Error loading event QR code:', error)
        setErrorMessage('Could not load this event\'s check-in QR code.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [params.id])

  const checkInUrl = event
    ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}/checkin/${event.qrCode}`
    : ''

  const handleDownload = () => {
    if (!qrImage || !event) return
    const link = document.createElement('a')
    link.href = qrImage
    link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-checkin-qr.png`
    link.click()
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="ADMIN">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (errorMessage || !event) {
    return (
      <AuthGuard requiredRole="ADMIN">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">{errorMessage || 'Event not found'}</h1>
              <Link href="/admin/events" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 print:bg-white">
        <div className="print:hidden">
          <Navigation />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 print:hidden">
            <Link
              href={`/admin/events/${params.id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Event
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center print:shadow-none print:border-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{event.title}</h1>
            <p className="text-sm text-gray-500 mb-6">
              Scan to check in &middot; {new Date(event.date).toLocaleDateString()}
            </p>

            {qrImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrImage}
                alt={`Check-in QR code for ${event.title}`}
                className="mx-auto rounded-lg border border-gray-200"
                width={300}
                height={300}
              />
            )}

            <p className="text-xs text-gray-400 mt-4 break-all">{checkInUrl}</p>

            <div className="flex items-center justify-center gap-3 mt-6 print:hidden">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6 print:hidden">
            Volunteers who scan this code (or open the link on their phone) while logged in and
            registered are checked in and awarded EcoTokens automatically.
          </p>
        </div>
      </div>
    </AuthGuard>
  )
}
