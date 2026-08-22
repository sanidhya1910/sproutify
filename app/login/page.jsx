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
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Nature,
  WbSunny,
} from '@mui/icons-material'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const muiTheme = useTheme()

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

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        // Send the user back to whatever page bounced them here (e.g. a QR
        // check-in link) when one was provided, otherwise their dashboard.
        const redirectTo = new URLSearchParams(window.location.search).get('redirect')
        if (redirectTo && redirectTo.startsWith('/')) {
          router.push(redirectTo)
        } else if (data.user.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push('/volunteer/dashboard')
        }
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            linear-gradient(180deg, rgba(0, 0, 0, 0.3), rgba(45, 80, 22, 0.2)),
            url('/background/bg.webp') center/cover no-repeat
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(46, 125, 50, 0.3))',
            zIndex: 1,
          },
        }}
      >
        <Navbar />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 12 }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center" minHeight="80vh">
            {/* Left Side - Welcome Content */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box sx={{ 
                  pr: { md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: { md: '20vh' },
                  py: { xs: 4, md: 0 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Nature 
                      sx={{ 
                        fontSize: '3rem', 
                        color: 'white',
                        mr: 2,
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                      }} 
                    />
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 800,
                        textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      Welcome Back
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      mb: 4, 
                      fontWeight: 400,
                      lineHeight: 1.6 
                    }}
                  >
                    Continue your environmental impact journey with Sproutify
                  </Typography>
                </Box>
              </Fade>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: { md: '40vh' },
                  py: { xs: 4, md: 0 }
                }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 6,
                      width: '100%',
                      maxWidth: 480,
                      borderRadius: '32px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(30px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                     
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          mb: 1,
                          color: 'white',
                          fontWeight: 800,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        Sign In
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Access your Sproutify account
                      </Typography>
                    </Box>

                    {error && (
                      <Fade in>
                        <Alert 
                          severity="error" 
                          sx={{ 
                            mb: 3,
                            borderRadius: '12px',
                            '& .MuiAlert-icon': {
                              fontSize: '1.5rem',
                            },
                          }}
                        >
                          {error}
                        </Alert>
                      </Fade>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        sx={{ 
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.15)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                              },
                            },
                            '&.Mui-focused': {
                              background: 'rgba(255, 255, 255, 0.15)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.8)',
                              },
                            },
                            '& input': {
                              color: 'white',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: 'white',
                            },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
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
                        sx={{ 
                          mb: 4,
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.15)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                              },
                            },
                            '&.Mui-focused': {
                              background: 'rgba(255, 255, 255, 0.15)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.8)',
                              },
                            },
                            '& input': {
                              color: 'white',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: 'white',
                            },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
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
                          py: 2.5,
                          mb: 3,
                          fontSize: '1.1rem',
                          borderRadius: '16px',
                          background: 'rgba(46, 125, 50, 0.8)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(46, 125, 50, 0.4)',
                          boxShadow: '0 8px 32px rgba(46, 125, 50, 0.3)',
                          '&:hover': { 
                            background: 'rgba(46, 125, 50, 0.9)',
                            backdropFilter: 'blur(25px)',
                            boxShadow: '0 12px 40px rgba(46, 125, 50, 0.4)',
                            transform: 'translateY(-2px)'
                          },
                          '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.5)'
                          },
                          transition: 'all 0.3s ease-in-out'
                        }}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          'Sign In'
                        )}
                      </Button>

                      <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', px: 2 }}>
                          New to Sproutify?
                        </Typography>
                      </Divider>

                      <Box sx={{ textAlign: 'center' }}>
                        <Link href="/register" passHref>
                          <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                              py: 2,
                              fontSize: '1rem',
                              borderRadius: '16px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              '&:hover': { 
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(25px)',
                                borderColor: 'rgba(255, 255, 255, 0.3)'
                              },
                              transition: 'all 0.3s ease-in-out'
                            }}
                          >
                            Create Account
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
        <Footer />
      </Box>
  )
}
