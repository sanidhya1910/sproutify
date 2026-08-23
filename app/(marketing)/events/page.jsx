"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Fade,
  alpha,
  Avatar,
  CardMedia,
} from '@mui/material';
import {
  Event,
  LocationOn,
  People,
  Schedule,
  Forest,
  FilterList,
  Search,
  CalendarMonth,
  Visibility,
} from '@mui/icons-material';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const demoEvents = [
      {
        _id: '1',
        title: 'Beach Cleanup Day',
        description: 'Join us for a day of cleaning up our beautiful beaches.',
        date: '2025-10-15T09:00:00.000Z',
        location: 'Sunnyvale Beach',
        volunteers: [],
        featuredImage: '/background/1.avif',
      },
      {
        _id: '2',
        title: 'Tree Planting Initiative',
        description: 'Help us plant 1,000 trees in the city park.',
        date: '2025-11-02T10:00:00.000Z',
        location: 'Greenwood Park',
        volunteers: [],
        featuredImage: '/background/2.avif',
      },
      {
        _id: '3',
        title: 'Recycling Drive',
        description: 'Collect and sort recyclable materials in the community.',
        date: '2025-11-20T11:00:00.000Z',
        location: 'Community Center',
        volunteers: [],
        featuredImage: '/background/3.avif',
      },
    ];
    setEvents(demoEvents);
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getEventTypeColor = (title) => {
    if (title?.toLowerCase().includes('cleanup')) return '#2e7d32';
    if (title?.toLowerCase().includes('plant')) return '#4caf50';
    if (title?.toLowerCase().includes('recycle')) return '#66bb6a';
    return '#1b5e20';
  };

  const getEventTypeIcon = (title) => {
    if (title?.toLowerCase().includes('cleanup')) return '🌊';
    if (title?.toLowerCase().includes('plant')) return '🌱';
    if (title?.toLowerCase().includes('recycle')) return '♻️';
    return '🌍';
  };

  return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'white',
          position: 'relative',
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 80% 80%, ${alpha('#2e7d32', 0.05)} 0%, transparent 50%),
              `,
            zIndex: 0,
          }}
        />

        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          {/* Header Section */}
          <Fade in timeout={600}>
            <Box sx={{ textAlign: 'center', py: 8, mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Event sx={{ fontSize: '4rem', color: 'white' }} />
                </Box>
              </Box>
              
              <Typography 
                variant="h1" 
                sx={{ 
                  mb: 3,
                  maxWidth: '800px',
                  mx: 'auto',
                }}
              >
                Environmental Events
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 6,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Join our community in making a positive environmental impact through organized events and activities
              </Typography>

              {/* Quick Stats */}
              <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '600px', mx: 'auto' }}>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: '16px',
                      background: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 800, mb: 1 }}>
                      {events.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Active Events
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: '16px',
                      background: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 800, mb: 1 }}>
                      50+
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Volunteers
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: '16px',
                      background: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 800, mb: 1 }}>
                      12
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Cities
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Fade>

          {/* Events Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            </Box>
          ) : events.length === 0 ? (
            <Fade in timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  p: 8,
                  textAlign: 'center',
                  borderRadius: '24px',
                  background: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                <Forest sx={{ fontSize: '4rem', color: 'text.disabled', mb: 3 }} />
                <Typography variant="h4" sx={{ color: 'text.secondary', mb: 2 }}>
                  No Events Available
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Check back soon for upcoming environmental events and activities
                </Typography>
              </Paper>
            </Fade>
          ) : (
            <Grid container spacing={4}>
              {events.map((event, index) => (
                <Grid item xs={12} sm={6} lg={4} key={event._id}>
                  <Fade in timeout={800 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: '24px',
                        background: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${getEventTypeColor(event.title)}, ${alpha(getEventTypeColor(event.title), 0.7)})`,
                        },
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.02)',
                          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      {/* Event Image/Icon */}
                      <Box
                        sx={{
                          height: '200px',
                          background: `linear-gradient(135deg, ${getEventTypeColor(event.title)}, ${alpha(getEventTypeColor(event.title), 0.8)})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `
                              radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                              radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
                            `,
                          },
                        }}
                      >
                        <Typography 
                          sx={{ 
                            fontSize: '4rem',
                            position: 'relative',
                            zIndex: 1,
                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                          }}
                        >
                          {getEventTypeIcon(event.title)}
                        </Typography>
                      </Box>

                      <CardContent sx={{ p: 4, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={event.category || 'Environmental'}
                            size="small"
                            sx={{
                              background: alpha(getEventTypeColor(event.title), 0.1),
                              color: getEventTypeColor(event.title),
                              fontWeight: 600,
                              border: `1px solid ${alpha(getEventTypeColor(event.title), 0.3)}`,
                            }}
                          />
                        </Box>

                        <Typography 
                          variant="h5" 
                          sx={{ 
                            mb: 2, 
                            color: 'primary.main',
                            fontWeight: 600,
                            lineHeight: 1.3,
                          }}
                        >
                          {event.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Schedule sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {formatDate(event.date)} at {event.time}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <LocationOn sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {event.location || 'Location TBD'}
                          </Typography>
                        </Box>

                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'text.primary',
                            lineHeight: 1.6,
                            mb: 3,
                          }}
                        >
                          {event.description?.slice(0, 120)}...
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            sx={{
                              bgcolor: getEventTypeColor(event.title),
                              width: 32,
                              height: 32,
                              mr: 2,
                            }}
                          >
                            <People sx={{ fontSize: '1rem' }} />
                          </Avatar>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {Math.floor(Math.random() * 30) + 10} volunteers registered
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 4, pt: 0 }}>
                        <Button
                          component={Link}
                          href={`/events/${event._id}`}
                          variant="contained"
                          fullWidth
                          startIcon={<Visibility />}
                          sx={{
                            py: 1.5,
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${getEventTypeColor(event.title)}, ${alpha(getEventTypeColor(event.title), 0.8)})`,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${alpha(getEventTypeColor(event.title), 0.9)}, ${getEventTypeColor(event.title)})`,
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}

          {/* CTA Section */}
          {events.length > 0 && (
            <Fade in timeout={1400}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '32px',
                  background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                  color: 'white',
                  p: 6,
                  textAlign: 'center',
                  mt: 8,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
                    `,
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h3" sx={{ mb: 2, color: 'white' }}>
                    Want to Host an Event?
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
                    Organize your own environmental initiative and inspire your community
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: '12px',
                      background: '#ffffff',
                      color: '#1b5e20',
                      '&:hover': {
                        background: 'white',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    href="/contact"
                  >
                    Contact Us
                  </Button>
                </Box>
              </Paper>
            </Fade>
          )}
        </Container>
      </Box>
  );
}
