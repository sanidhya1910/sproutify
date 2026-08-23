"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Fade,
  CircularProgress,
  Divider,
  Grid,
  alpha,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from '@mui/icons-material'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/login?message=Registration successful')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #2e7d32 0%, #81c784 100%)',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          <Grid container spacing={0} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={7}>
              <Fade in timeout={800}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper
                    elevation={6}
                    sx={{
                      p: { xs: 3, md: 5 },
                      width: '100%',
                      maxWidth: 480,
                      borderRadius: '24px',
                      background: alpha('#fff', 0.85),
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 8px 32px rgba(46,125,50,0.15)',
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 1,
                          fontWeight: 700,
                          color: 'primary.main',
                          letterSpacing: 1,
                        }}
                      >
                        Join Sproutify
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Start making a positive environmental impact
                      </Typography>
                    </Box>

                    {error && (
                      <Fade in>
                        <Alert
                          severity="error"
                          sx={{
                            mb: 2,
                            borderRadius: '10px',
                          }}
                        >
                          {error}
                        </Alert>
                      </Fade>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: 'primary.main' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        sx={{ mb: 3 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                                sx={{ color: 'primary.main' }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                          py: 1.5,
                          mb: 2,
                          fontSize: '1.1rem',
                          borderRadius: '8px',
                        }}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          'Create Account'
                        )}
                      </Button>

                      <Divider sx={{ my: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                          Already have an account?
                        </Typography>
                      </Divider>

                      <Box sx={{ textAlign: 'center' }}>
                        <Link href="/login" passHref>
                          <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                              py: 1.5,
                              fontSize: '1rem',
                              borderRadius: '8px',
                            }}
                          >
                            Sign In
                          </Button>
                        </Link>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
  )
}
