"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  CheckCircle,
  QrCodeScanner,
  EventAvailable,
  LocationOn,
  Schedule,
} from '@mui/icons-material'
import Navbar from '@/components/chrome/Navbar'

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

export default function CheckInPage() {
  const { qrCode } = useParams()
  const router = useRouter()

  const [status, setStatus] = useState('loading') // loading | ready | checking-in | success | error
  const [data, setData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [awardedTokens, setAwardedTokens] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push(`/login?redirect=/checkin/${qrCode}`)
      return
    }

    fetch(`/api/checkin/${qrCode}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body.message || 'Could not load event')
        setData(body)
        setStatus('ready')
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Could not load this check-in link')
        setStatus('error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCode])

  const handleCheckIn = async () => {
    setStatus('checking-in')
    setErrorMessage('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/checkin/${qrCode}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.message || 'Check-in failed')
      setAwardedTokens(body.tokensAwarded)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err.message || 'Check-in failed. Please try again.')
      setStatus('ready')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      <Navbar />
      <Container
        maxWidth="sm"
        sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: '24px',
            textAlign: 'center',
            border: '1px solid rgba(46, 125, 50, 0.15)',
            width: '100%',
          }}
        >
          {status === 'loading' && (
            <Box sx={{ py: 4 }}>
              <CircularProgress sx={{ color: 'primary.main', mb: 2 }} />
              <Typography color="text.secondary">Loading check-in details…</Typography>
            </Box>
          )}

          {status === 'error' && (
            <Box>
              <Alert severity="error" sx={{ borderRadius: '12px', mb: 3, textAlign: 'left' }}>
                {errorMessage}
              </Alert>
              <Button component={Link} href="/volunteer/events" variant="outlined">
                Browse events
              </Button>
            </Box>
          )}

          {(status === 'ready' || status === 'checking-in') && data && (
            <Box>
              <QrCodeScanner sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {data.event.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                <Schedule sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(data.event.date)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
                <LocationOn sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {data.event.location}
                </Typography>
              </Box>

              {errorMessage && (
                <Alert severity="error" sx={{ borderRadius: '12px', mb: 3, textAlign: 'left' }}>
                  {errorMessage}
                </Alert>
              )}

              {!data.isRegistered ? (
                <>
                  <Alert severity="warning" sx={{ borderRadius: '12px', mb: 3, textAlign: 'left' }}>
                    You&apos;re not registered for this event yet.
                  </Alert>
                  <Button component={Link} href={`/volunteer/events/${data.event.id}`} variant="contained">
                    View event &amp; register
                  </Button>
                </>
              ) : data.alreadyCheckedIn ? (
                <Alert severity="success" sx={{ borderRadius: '12px', textAlign: 'left' }}>
                  You&apos;re already checked in for this event.
                </Alert>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  disabled={status === 'checking-in'}
                  onClick={handleCheckIn}
                  startIcon={status === 'checking-in' ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <EventAvailable />}
                  sx={{ px: 5, py: 1.5 }}
                >
                  {status === 'checking-in' ? 'Checking in…' : 'Check In'}
                </Button>
              )}
            </Box>
          )}

          {status === 'success' && (
            <Box>
              <CheckCircle sx={{ fontSize: '4rem', color: 'success.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                You&apos;re checked in!
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                {awardedTokens != null ? `+${awardedTokens} EcoTokens awarded. ` : ''}
                Thanks for showing up and making a difference.
              </Typography>
              <Button component={Link} href="/volunteer/dashboard" variant="contained">
                Go to dashboard
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
