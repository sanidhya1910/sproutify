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
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  alpha,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Search,
  LocationOn,
  Schedule,
  Group,
  Event,
  CheckCircle,
  Cancel,
  FilterList,
  EnergySavingsLeaf,
  Water,
  Forest,
  Recycling,
  Visibility,
  PersonAdd,
  PersonRemove,
  Warning,
} from '@mui/icons-material'
import AuthGuard from '@/components/auth/auth-guard'
import Link from 'next/link'
import { useSnackbar } from '@/app/providers'

export default function VolunteerEvents() {
  const { showError } = useSnackbar()
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterType, setFilterType] = useState('')
  const [showRegistered, setShowRegistered] = useState(false)
  const [registrationLoading, setRegistrationLoading] = useState(new Set())
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    fetchEvents()
    fetchRegistrations()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, filterLocation, filterDate, filterType, showRegistered, tabValue])

  const fetchEvents = async () => {
    setFetchError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/volunteer/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        throw new Error('Failed to load events')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
      setFetchError('Could not load events. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/volunteer/registrations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRegisteredEvents(new Set(data.map(reg => reg.eventId)))
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    }
  }

  const filterEvents = () => {
    let filtered = events

    // Filter by tab (upcoming vs past events)
    const now = new Date()
    if (tabValue === 0) {
      filtered = filtered.filter(event => new Date(event.date) >= now)
    } else {
      filtered = filtered.filter(event => new Date(event.date) < now)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by location
    if (filterLocation) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(filterLocation.toLowerCase())
      )
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date).toISOString().split('T')[0]
        return eventDate === filterDate
      })
    }

    // Filter by type
    if (filterType) {
      filtered = filtered.filter(event => event.type === filterType)
    }

    // Filter by registration status
    if (showRegistered) {
      filtered = filtered.filter(event => registeredEvents.has(event.id))
    }

    setFilteredEvents(filtered)
  }

  const handleRegister = async (eventId) => {
    setRegistrationLoading(prev => new Set(prev).add(eventId))
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/volunteer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId })
      })

      if (response.ok) {
        setRegisteredEvents(prev => new Set(prev).add(eventId))
      } else {
        const data = await response.json()
        showError(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Error registering for event:', error)
      showError('Registration failed. Please try again.')
    } finally {
      setRegistrationLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
    }
  }

  const handleUnregister = async (eventId) => {
    setRegistrationLoading(prev => new Set(prev).add(eventId))
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/volunteer/unregister', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId })
      })

      if (response.ok) {
        setRegisteredEvents(prev => {
          const newSet = new Set(prev)
          newSet.delete(eventId)
          return newSet
        })
      } else {
        const data = await response.json()
        showError(data.message || 'Unregistration failed')
      }
    } catch (error) {
      console.error('Error unregistering from event:', error)
      showError('Unregistration failed. Please try again.')
    } finally {
      setRegistrationLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'cleanup': return <Water sx={{ fontSize: '1.5rem' }} />
      case 'plantation': return <Forest sx={{ fontSize: '1.5rem' }} />
      case 'ewaste': return <Recycling sx={{ fontSize: '1.5rem' }} />
      default: return <EnergySavingsLeaf sx={{ fontSize: '1.5rem' }} />
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

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'cleanup': return 'Beach Cleanup'
      case 'plantation': return 'Tree Plantation'
      case 'ewaste': return 'E-Waste Collection'
      default: return 'Environmental Event'
    }
  }

  const getUniqueLocations = () => {
    const locations = events.map(event => event.location)
    return [...new Set(locations)].sort()
  }

  const isEventPast = (eventDate) => {
    return new Date(eventDate) < new Date()
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="VOLUNTEER">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        </Box>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="VOLUNTEER">
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
                <Typography
                  variant="h2"
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Environmental Events
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                  Discover and join environmental initiatives in your area. Make a difference today!
                </Typography>

                {/* Event Type Tabs */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    background: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    mb: 4,
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{
                      '& .MuiTab-root': {
                        borderRadius: '16px',
                        margin: 1,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                      },
                      '& .Mui-selected': {
                        background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                        color: 'white !important',
                      },
                    }}
                  >
                    <Tab label="Upcoming Events" />
                    <Tab label="Past Events" />
                  </Tabs>
                </Paper>
              </Box>
            </Fade>

            {/* Filters Section */}
            <Fade in timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  p: 4,
                  mb: 4,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <FilterList sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ color: 'primary.main' }}>
                    Filter Events
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Search Events"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Location</InputLabel>
                      <Select
                        value={filterLocation}
                        label="Location"
                        onChange={(e) => setFilterLocation(e.target.value)}
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value="">All Locations</MenuItem>
                        {getUniqueLocations().map(location => (
                          <MenuItem key={location} value={location}>{location}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Event Type</InputLabel>
                      <Select
                        value={filterType}
                        label="Event Type"
                        onChange={(e) => setFilterType(e.target.value)}
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value="">All Types</MenuItem>
                        <MenuItem value="cleanup">Beach Cleanup</MenuItem>
                        <MenuItem value="plantation">Tree Plantation</MenuItem>
                        <MenuItem value="ewaste">E-Waste Collection</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showRegistered}
                          onChange={(e) => setShowRegistered(e.target.checked)}
                          sx={{ color: 'primary.main' }}
                        />
                      }
                      label="Show only registered events"
                    />
                    {(searchTerm || filterLocation || filterDate || filterType || showRegistered) && (
                      <Button
                        size="small"
                        onClick={() => {
                          setSearchTerm('')
                          setFilterLocation('')
                          setFilterDate('')
                          setFilterType('')
                          setShowRegistered(false)
                        }}
                        sx={{ ml: 2, borderRadius: '8px' }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </Grid>
                </Grid>

                {(searchTerm || filterLocation || filterDate || filterType || showRegistered) && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Showing {filteredEvents.length} of {events.length} events
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Fade>

            {fetchError && (
              <Alert
                severity="error"
                sx={{ borderRadius: '12px', mb: 3 }}
                action={
                  <Button color="inherit" size="small" onClick={fetchEvents}>
                    Retry
                  </Button>
                }
              >
                {fetchError}
              </Alert>
            )}

            {/* Events Grid */}
            <Fade in timeout={1000}>
              <Box>
                {filteredEvents.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: '20px',
                      background: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                      p: 8,
                      textAlign: 'center',
                    }}
                  >
                    <Event sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                      {searchTerm || filterLocation || filterDate || filterType || showRegistered 
                        ? 'No events found' 
                        : 'No events available'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {searchTerm || filterLocation || filterDate || filterType || showRegistered
                        ? 'Try adjusting your search or filter criteria'
                        : 'Check back later for new environmental initiatives'}
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={4}>
                    {filteredEvents.map((event) => {
                      const isRegistered = registeredEvents.has(event.id)
                      const isLoading = registrationLoading.has(event.id)
                      const isPast = isEventPast(event.date)
                      
                      return (
                        <Grid item xs={12} lg={6} xl={4} key={event.id}>
                          <Card
                            sx={{
                              borderRadius: '20px',
                              background: '#ffffff',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                              transition: 'all 0.3s ease',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                              },
                            }}
                          >
                            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                              {/* Event Header */}
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar
                                    sx={{
                                      background: alpha(getEventColor(event.type), 0.1),
                                      color: getEventColor(event.type),
                                      mr: 2,
                                    }}
                                  >
                                    {getEventIcon(event.type)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                      {event.title}
                                    </Typography>
                                    <Chip
                                      label={getEventTypeLabel(event.type)}
                                      size="small"
                                      sx={{
                                        background: alpha(getEventColor(event.type), 0.1),
                                        color: getEventColor(event.type),
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  </Box>
                                </Box>
                                {isRegistered && (
                                  <CheckCircle sx={{ color: '#4caf50' }} />
                                )}
                              </Box>

                              {/* Event Details */}
                              <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary', mr: 2 }} />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {event.location}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Schedule sx={{ fontSize: '1rem', color: 'text.secondary', mr: 2 }} />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Group sx={{ fontSize: '1rem', color: 'text.secondary', mr: 2 }} />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {event._count.registrations} registered
                                    {event.expectedVolunteers && ` / ${event.expectedVolunteers} expected`}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Description */}
                              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>
                                {event.description}
                              </Typography>

                              {/* Safety Instructions */}
                              {event.safetyInstructions && (
                                <Alert
                                  icon={<Warning />}
                                  severity="warning"
                                  sx={{
                                    mb: 3,
                                    borderRadius: '12px',
                                    backgroundColor: alpha('#ff9800', 0.1),
                                    border: `1px solid ${alpha('#ff9800', 0.2)}`,
                                    '& .MuiAlert-message': {
                                      fontSize: '0.875rem',
                                    },
                                  }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                                    Safety Instructions
                                  </Typography>
                                  {event.safetyInstructions}
                                </Alert>
                              )}

                              {/* Action Buttons */}
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<Visibility />}
                                  component={Link}
                                  href={`/volunteer/events/${event.id}`}
                                  sx={{ borderRadius: '8px' }}
                                >
                                  View Details
                                </Button>
                                
                                {!isPast && (
                                  <Box>
                                    {isRegistered ? (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={isLoading ? <CircularProgress size={16} /> : <PersonRemove />}
                                        onClick={() => handleUnregister(event.id)}
                                        disabled={isLoading}
                                        sx={{ borderRadius: '8px' }}
                                      >
                                        {isLoading ? 'Unregistering...' : 'Unregister'}
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <PersonAdd />}
                                        onClick={() => handleRegister(event.id)}
                                        disabled={isLoading}
                                        sx={{ borderRadius: '8px' }}
                                      >
                                        {isLoading ? 'Registering...' : 'Register'}
                                      </Button>
                                    )}
                                  </Box>
                                )}
                                
                                {isPast && (
                                  <Chip
                                    label="Event Completed"
                                    variant="outlined"
                                    size="small"
                                    sx={{ color: 'text.secondary' }}
                                  />
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    })}
                  </Grid>
                )}
              </Box>
            </Fade>
          </Container>
        </Box>
    </AuthGuard>
  )
}
