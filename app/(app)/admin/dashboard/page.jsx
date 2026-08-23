"use client"

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Fade,
  CircularProgress,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Alert,
} from '@mui/material'
import {
  Event,
  Group,
  CheckCircle,
  TrendingUp,
  Add,
  Visibility,
  AdminPanelSettings,
  Assessment,
  Schedule,
  LocationOn,
  PeopleAlt,
  EmojiEvents,
  EnergySavingsLeaf,
  Water,
  Forest,
  Recycling,
  Analytics,
  ManageAccounts,
  CalendarMonth,
} from '@mui/icons-material'
import AuthGuard from '@/components/auth/auth-guard'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalVolunteers: 0,
    totalAttendance: 0,
    monthlyGrowth: 0,
    ecoImpact: 0
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [topVolunteers, setTopVolunteers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load dashboard data')
      }

      const data = await response.json()
      setStats(data.stats)
      setRecentEvents(data.recentEvents)
      setTopVolunteers(data.topVolunteers || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setFetchError('Could not load dashboard data. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'cleanup': return <Water sx={{ color: '#2196f3' }} />
      case 'plantation': return <Forest sx={{ color: '#4caf50' }} />
      case 'ewaste': return <Recycling sx={{ color: '#ff9800' }} />
      default: return <EnergySavingsLeaf sx={{ color: '#66bb6a' }} />
    }
  }

  const getEventColor = (type) => {
    switch (type) {
      case 'cleanup': return '#2196f3'
      case 'plantation': return '#4caf50'
      case 'ewaste': return '#ff9800'
      default: return '#66bb6a'
    }
  }

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: <Event sx={{ fontSize: '2rem' }} />,
      color: '#1b5e20',
      change: `+${stats.monthlyGrowth}% this month`,
      trend: 'up'
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      icon: <TrendingUp sx={{ fontSize: '2rem' }} />,
      color: '#2e7d32',
      change: 'Currently running',
      trend: 'neutral'
    },
    {
      title: 'Total Volunteers',
      value: stats.totalVolunteers,
      icon: <Group sx={{ fontSize: '2rem' }} />,
      color: '#4caf50',
      change: '+15% this month',
      trend: 'up'
    },
    {
      title: 'Total Attendance',
      value: stats.totalAttendance,
      icon: <CheckCircle sx={{ fontSize: '2rem' }} />,
      color: '#66bb6a',
      change: `${stats.ecoImpact}% completion rate`,
      trend: 'up'
    }
  ]

  const quickActions = [
    {
      title: 'Create New Event',
      description: 'Plan and organize environmental initiatives',
      icon: <Add sx={{ fontSize: '2rem' }} />,
      color: '#1b5e20',
      href: '/admin/events/create'
    },
    {
      title: 'View All Events',
      description: 'Manage existing and upcoming events',
      icon: <Visibility sx={{ fontSize: '2rem' }} />,
      color: '#2e7d32',
      href: '/admin/events'
    },
    {
      title: 'Manage Volunteers',
      description: 'View and manage volunteer accounts',
      icon: <ManageAccounts sx={{ fontSize: '2rem' }} />,
      color: '#4caf50',
      href: '/admin/volunteers'
    },
    {
      title: 'Analytics',
      description: 'View detailed reports and insights',
      icon: <Analytics sx={{ fontSize: '2rem' }} />,
      color: '#66bb6a',
      href: '/admin/analytics'
    }
  ]

  if (isLoading) {
    return (
      <AuthGuard requiredRole="ADMIN">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        </Box>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="ADMIN">
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'white',
          }}
        >

          
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Section */}
            <Fade in timeout={600}>
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AdminPanelSettings sx={{ fontSize: '3rem', color: 'primary.main', mr: 2 }} />
                  <Typography
                    variant="h2"
                    sx={{
                      background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Admin Dashboard
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  Manage environmental events, volunteers, and track platform impact
                </Typography>
              </Box>
            </Fade>

            {fetchError && (
              <Alert
                severity="error"
                sx={{ borderRadius: '12px', mb: 4 }}
                action={
                  <Button color="inherit" size="small" onClick={fetchDashboardData}>
                    Retry
                  </Button>
                }
              >
                {fetchError}
              </Alert>
            )}

            {/* Stats Cards */}
            <Fade in timeout={800}>
              <Grid container spacing={4} sx={{ mb: 6 }}>
                {statCards.map((stat, index) => (
                  <Grid item xs={12} sm={6} lg={3} key={index}>
                    <Card
                      sx={{
                        borderRadius: '20px',
                        background: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: '12px',
                              background: alpha(stat.color, 0.1),
                              color: stat.color,
                            }}
                          >
                            {stat.icon}
                          </Box>
                          <Chip
                            label={stat.change}
                            size="small"
                            sx={{
                              background: alpha('#4caf50', 0.1),
                              color: '#2e7d32',
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {stat.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Fade>

            {/* Quick Actions */}
            <Fade in timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  p: 4,
                  mb: 6,
                }}
              >
                <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={3}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                      <Button
                        component={Link}
                        href={action.href}
                        sx={{
                          p: 3,
                          height: '100%',
                          width: '100%',
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${action.color}, ${alpha(action.color, 0.8)})`,
                          color: 'white',
                          textTransform: 'none',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 12px 24px ${alpha(action.color, 0.3)}`,
                          },
                        }}
                      >
                        <Box sx={{ mb: 2 }}>
                          {action.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'left' }}>
                          {action.description}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Fade>

            <Grid container spacing={4}>
              {/* Recent Events */}
              <Grid item xs={12} lg={8}>
                <Fade in timeout={1200}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: '20px',
                      background: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                      p: 4,
                    }}
                  >
                    <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
                      Recent Events
                    </Typography>
                    {recentEvents.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <CalendarMonth sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                          No events created yet
                        </Typography>
                      </Box>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Event</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Date & Location</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Registration</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Attendance</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {recentEvents.map((event) => {
                              const attendanceRate = event._count.attendances / event._count.registrations * 100
                              return (
                                <TableRow key={event.id} sx={{ '&:hover': { backgroundColor: alpha('#4caf50', 0.05) } }}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar sx={{ mr: 2, background: alpha(getEventColor(event.type), 0.1) }}>
                                        {getEventIcon(event.type)}
                                      </Avatar>
                                      <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                          {event.title}
                                        </Typography>
                                        <Chip
                                          label={event.type}
                                          size="small"
                                          sx={{
                                            background: alpha(getEventColor(event.type), 0.1),
                                            color: getEventColor(event.type),
                                            fontSize: '0.7rem',
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box>
                                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <Schedule sx={{ fontSize: '0.9rem', mr: 1 }} />
                                        {new Date(event.date).toLocaleDateString()}
                                      </Typography>
                                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                        <LocationOn sx={{ fontSize: '0.9rem', mr: 1 }} />
                                        {event.location}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                      {event._count.registrations}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="h6" sx={{ color: 'success.main' }}>
                                      {event._count.attendances}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ width: '100%' }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">{attendanceRate.toFixed(0)}%</Typography>
                                      </Box>
                                      <LinearProgress
                                        variant="determinate"
                                        value={attendanceRate}
                                        sx={{
                                          height: 6,
                                          borderRadius: 3,
                                          backgroundColor: alpha('#4caf50', 0.1),
                                          '& .MuiLinearProgress-bar': {
                                            borderRadius: 3,
                                            backgroundColor: '#4caf50',
                                          },
                                        }}
                                      />
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Paper>
                </Fade>
              </Grid>

              {/* Top Volunteers */}
              <Grid item xs={12} lg={4}>
                <Fade in timeout={1400}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: '20px',
                      background: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                      p: 4,
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
                      Top Volunteers
                    </Typography>
                    <List>
                      {topVolunteers.map((volunteer, index) => (
                        <ListItem key={volunteer.id} sx={{ px: 0, mb: 1 }}>
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                background: `linear-gradient(135deg, ${index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32'}, ${alpha(index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32', 0.8)})`,
                                color: 'white',
                                fontWeight: 800,
                              }}
                            >
                              {index + 1}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {volunteer.name}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {volunteer.events} events • Level {volunteer.level}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                  <EnergySavingsLeaf sx={{ fontSize: '0.9rem', color: '#4caf50', mr: 0.5 }} />
                                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                    {volunteer.tokens} tokens
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Button
                      fullWidth
                      variant="outlined"
                      component={Link}
                      href="/admin/volunteers"
                      sx={{ borderRadius: '12px' }}
                    >
                      View All Volunteers
                    </Button>
                  </Paper>
                </Fade>
              </Grid>
            </Grid>
          </Container>
        </Box>
    </AuthGuard>
  )
}
