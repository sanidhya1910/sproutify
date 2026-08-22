"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Box, Container, Typography, Button, Paper } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import Navbar from '@/components/common/Navbar'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <ErrorOutline sx={{ fontSize: '3.5rem', color: 'error.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            An unexpected error occurred. You can try again, or head back home.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button component={Link} href="/" variant="outlined">
              Go home
            </Button>
            <Button variant="contained" onClick={() => reset()}>
              Try again
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
