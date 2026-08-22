"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Chip
} from '@mui/material'
import {
  LocalFlorist,
  Dashboard,
  Event,
  People,
  QrCodeScanner,
  Logout,
  Menu as MenuIcon,
  Close,
  AccountCircle,
  Person
} from '@mui/icons-material'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser(payload)
      } catch (error) {
        console.error('Error parsing token:', error)
      }
    }
  }, [])

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    handleUserMenuClose()
    router.push('/')
  }

  const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { href: '/admin/events', label: 'Events', icon: <Event /> },
    { href: '/admin/volunteers', label: 'Volunteers', icon: <People /> },
    // { href: '/admin/qr-scanner', label: 'QR Scanner', icon: <QrCodeScanner /> },
  ]

  const volunteerNavItems = [
    { href: '/volunteer/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { href: '/volunteer/events', label: 'Events', icon: <Event /> },
    { href: '/volunteer/my-events', label: 'My Events', icon: <Person /> },
  ]

  const navItems = user?.role === 'ADMIN' ? adminNavItems : volunteerNavItems

  return (
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 191, 165, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <LocalFlorist sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Sproutify
            </Typography>
            {user && (
              <Chip 
                label={user.role === 'ADMIN' ? 'Admin' : 'Volunteer'}
                size="small"
                sx={{ 
                  ml: 2,
                  backgroundColor: user.role === 'ADMIN' ? '#f44336' : '#2196f3',
                  color: 'white',
                  fontWeight: 500
                }}
              />
            )}
          </Box>

          {user && (
            <>
              {/* Desktop Menu */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      startIcon={item.icon}
                      onClick={() => router.push(item.href)}
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(0, 191, 165, 0.2)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>
              )}

              {/* User Menu */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isMobile && (
                  <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <Close /> : <MenuIcon />}
                  </IconButton>
                )}
                
                <Typography variant="body2" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                  Welcome, {user.name}
                </Typography>
                <IconButton onClick={handleUserMenuClick} sx={{ p: 0 }}>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: user.role === 'ADMIN' ? '#f44336' : '#2196f3'
                  }}>
                    {user.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => { 
                    handleUserMenuClose(); 
                    router.push('/profile'); 
                  }}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>

              {/* Mobile Menu */}
              {isMobile && mobileMenuOpen && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '0 0 16px 16px',
                    p: 2,
                    zIndex: 1000
                  }}
                >
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      fullWidth
                      startIcon={item.icon}
                      onClick={() => {
                        router.push(item.href);
                        setMobileMenuOpen(false);
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        mb: 1,
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white'
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Welcome, {user.name}
                    </Typography>
                    <Button
                      fullWidth
                      startIcon={<AccountCircle />}
                      onClick={() => {
                        router.push('/profile');
                        setMobileMenuOpen(false);
                      }}
                      sx={{ mb: 1, justifyContent: 'flex-start' }}
                    >
                      Profile
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<Logout />}
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      sx={{ justifyContent: 'flex-start', color: 'error.main' }}
                    >
                      Logout
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
  )
}