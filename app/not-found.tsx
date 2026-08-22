"use client"

import Link from 'next/link'
import { Box, Container, Typography, Button, Paper } from '@mui/material'
import { Nature } from '@mui/icons-material'
import Navbar from '@/components/common/Navbar'

export default function NotFound() {
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
          <Nature sx={{ fontSize: '3.5rem', color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            404
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            This page has wandered off the trail
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button component={Link} href="/events" variant="outlined">
              Browse events
            </Button>
            <Button component={Link} href="/" variant="contained">
              Go home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
