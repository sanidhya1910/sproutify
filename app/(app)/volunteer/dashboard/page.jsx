"use client";

import React from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Avatar,
  Chip,
  Button,
  alpha,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
  Stack,
  Badge,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Event,
  CheckCircle,
  Schedule,
  LocationOn,
  Star,
  EmojiEvents,
  Recycling,
  Forest,
  Water,
  TrendingUp,
  AutoAwesome,
  Celebration,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/components/auth/auth-guard';
import Link from 'next/link';

const fetchDashboardData = async () => {
  // AuthGuard blocks this page from rendering until a valid VOLUNTEER token
  // exists, so a missing token here is a genuine error, not a "not logged
  // in yet" state — surface it as a real failure rather than silently
  // showing fabricated demo data.
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    throw new Error('Not authenticated');
  }
  const response = await fetch('/api/volunteer/dashboard', { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to load dashboard data');
  const data = await response.json();
  return { ...data, user: data?.user ?? { name: 'Volunteer' } };
};

const getEventIcon = (type) => {
  switch (type) {
    case 'cleanup': return <Water />;
    case 'plantation': return <Forest />;
    case 'ewaste': return <Recycling />;
    default: return <Event />;
  }
};

const getEventColor = (type) => {
  switch (type) {
    case 'cleanup': return '#2196f3';
    case 'plantation': return '#4caf50';
    case 'ewaste': return '#ff9800';
    default: return '#666';
  }
};

function StatCard({ title, value, icon, color = '#2e7d32', change }) {
  const currentTheme = useTheme();
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.01)} 100%)`,
        border: `1px solid ${alpha(color, 0.16)}`,
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(color, 0.18)}`,
          border: `1px solid ${alpha(color, 0.28)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color, mb: 0.5, lineHeight: 1.2 }}>
              {value}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {title}
            </Typography>
            {change && (
              <Chip
                label={change}
                size="small"
                sx={{
                  mt: 1,
                  backgroundColor: alpha(currentTheme.palette.success.main, 0.16),
                  color: 'success.main',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Avatar sx={{ width: 64, height: 64, backgroundColor: alpha(color, 0.13), color, border: `2px solid ${alpha(color, 0.25)}` }}>
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function VolunteerDashboard() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['dashboardData'], queryFn: fetchDashboardData });

  if (isLoading) {
    return (
      <AuthGuard requiredRole="VOLUNTEER">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
          <CircularProgress />
        </Box>
      </AuthGuard>
    );
  }

  if (isError || !data) {
    return (
      <AuthGuard requiredRole="VOLUNTEER">
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
          <Typography variant="h5" color="text.secondary">Could not load dashboard data.</Typography>
          <Typography color="text.secondary">Please try again later.</Typography>
        </Box>
      </AuthGuard>
    );
  }

  const {
    stats = { registeredEvents: 0, attendedEvents: 0, upcomingEvents: 0 },
    upcomingEvents = [],
    recentActivities = [],
    ecoTokens = 0,
    volunteerLevel = 1,
    progress = 0,
    achievements = [],
    user = { name: 'Volunteer' },
  } = data || {};

  return (
    <AuthGuard requiredRole="VOLUNTEER">
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 3 }}>
          <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: 'text.primary',
                  mb: 1,
                  background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Welcome back, {user?.name || 'Volunteer'}!
                <Tooltip title="You're making a difference!">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <Celebration sx={{ color: '#ffd700' }} />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                Here's a summary of your green journey with Sproutify.
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid xs={12} lg={8}>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid xs={12} sm={4}>
                    <StatCard
                      title="Events Attended"
                      value={stats?.attendedEvents || 0}
                      icon={<CheckCircle />}
                      color="#4caf50"
                      change="+8 this month"
                    />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <StatCard
                      title="Upcoming Events"
                      value={stats?.upcomingEvents || 0}
                      icon={<Schedule />}
                      color="#2196f3"
                      change="2 this week"
                    />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <StatCard
                      title="EcoTokens Earned"
                      value={ecoTokens || 0}
                      icon={<Forest />}
                      color="#ff9800"
                      change="+25 today"
                    />
                  </Grid>
                </Grid>

                <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        <Event />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          Upcoming Events
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your next environmental adventures
                        </Typography>
                      </Box>
                    </Stack>
                    {upcomingEvents && upcomingEvents.length > 0 ? (
                      <Stack spacing={2}>
                        {upcomingEvents.map((event) => (
                          <Card
                            key={event._id}
                            elevation={0}
                            sx={{
                              border: '1px solid',
                              borderColor: alpha(getEventColor(event.type), 0.2),
                              borderRadius: 2,
                              background: alpha(getEventColor(event.type), 0.07),
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'translateX(8px)',
                                borderColor: alpha(getEventColor(event.type), 0.4),
                                boxShadow: `0 4px 12px ${alpha(getEventColor(event.type), 0.15)}`,
                              },
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(getEventColor(event.type), 0.13), color: getEventColor(event.type), width: 56, height: 56 }}>
                                  {getEventIcon(event.type)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {event.title}
                                  </Typography>
                                  <Stack direction="row" spacing={3}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Schedule sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {event.date} at {event.time}
                                      </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <LocationOn sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {event.location}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </Box>
                                <Button
                                  variant="contained"
                                  size="small"
                                  component={Link}
                                  href={`/volunteer/events/${event._id}`}
                                  sx={{ borderRadius: 2, fontWeight: 600, px: 3, background: `linear-gradient(45deg, ${getEventColor(event.type)}, ${alpha(getEventColor(event.type), 0.8)})` }}
                                >
                                  View Details
                                </Button>
                              </Stack>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Avatar sx={{ bgcolor: 'grey.100', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                          <Event sx={{ fontSize: 40, color: 'grey.400' }} />
                        </Avatar>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                          No upcoming events
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Time to find a new adventure!
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ px: 4, pb: 3 }}>
                    <Button component={Link} href="/events" variant="outlined" size="large" sx={{ borderRadius: 2, fontWeight: 600, px: 4 }} startIcon={<Event />}>
                      Browse All Events
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid xs={12} lg={4}>
                <Stack spacing={4}>
                  <Card elevation={0} sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Badge badgeContent={<AutoAwesome sx={{ fontSize: 16 }} />} color="warning" sx={{ mb: 2 }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.25)', fontSize: '2rem', fontWeight: 800, mx: 'auto', mb: 2 }}>
                          {volunteerLevel || 1}
                        </Avatar>
                      </Badge>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        Level {volunteerLevel || 1} Volunteer
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                        {100 - (progress || 0)}% to reach Level {(volunteerLevel || 1) + 1}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress || 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          '.MuiLinearProgress-bar': { backgroundColor: '#ffd700' },
                        }}
                      />
                    </CardContent>
                    <CardActions sx={{ px: 4, pb: 3, justifyContent: 'center' }}>
                      <Button
                        component={Link}
                        href="/volunteer/redeem-shop"
                        variant="contained"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 2, fontWeight: 600,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
                        }}
                        startIcon={<Star />}
                      >
                        Redeem {ecoTokens || 0} Tokens
                      </Button>
                    </CardActions>
                  </Card>
                  <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', background: 'linear-gradient(135deg, #fff 0%, #fff8e1 100%)' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                          <EmojiEvents />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          Achievements
                        </Typography>
                      </Stack>
                      {achievements && achievements.length > 0 ? (
                        <Stack spacing={2}>
                          {achievements.map((ach, index) => (
                            <Box key={index} sx={{ p: 2, borderRadius: 2, background: alpha('#ffc107', 0.1), border: '1px solid', borderColor: alpha('#ffc107', 0.2) }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha('#ffc107', 0.23), color: '#ed6c02' }}>
                                  {ach.icon}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {ach.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {ach.description}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                          <Avatar sx={{ bgcolor: 'grey.100', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                            <EmojiEvents sx={{ fontSize: 30, color: 'grey.400' }} />
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            No achievements yet. Keep volunteering!
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                  <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
                          <TrendingUp />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          Recent Activity
                        </Typography>
                      </Stack>
                      {recentActivities && recentActivities.length > 0 ? (
                        <Stack spacing={2}>
                          {recentActivities.map((act, index) => (
                            <Box key={index} sx={{ p: 2, borderRadius: 2, background: alpha(getEventColor(act.type), 0.1), border: '1px solid', borderColor: alpha(getEventColor(act.type), 0.2) }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(getEventColor(act.type), 0.19), color: getEventColor(act.type) }}>
                                  {getEventIcon(act.type)}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {act.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {act.impact}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                          <Avatar sx={{ bgcolor: 'grey.100', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                            <TrendingUp sx={{ fontSize: 30, color: 'grey.400' }} />
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            No recent activities to show.
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
    </AuthGuard>
  );
}
