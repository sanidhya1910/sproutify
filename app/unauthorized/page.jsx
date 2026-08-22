"use client"

import Link from 'next/link'
import { Box, Container, Typography, Button, Paper } from '@mui/material'
import { Lock } from '@mui/icons-material'
import Navbar from '@/components/common/Navbar'

export default function Unauthorized() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
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
          <Lock sx={{ fontSize: '3.5rem', color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Access denied
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            You don&apos;t have permission to view this page. If you think this is a
            mistake, sign in with the correct account.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button component={Link} href="/" variant="outlined">
              Go home
            </Button>
            <Button component={Link} href="/login" variant="contained">
              Sign in
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
