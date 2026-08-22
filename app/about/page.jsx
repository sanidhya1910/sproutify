"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Fade,
  Zoom,
  Avatar,
  Paper,
  Button,
  alpha,
} from '@mui/material';
import {
  Group,
  EnergySavingsLeaf,
  Forest,
  WaterDrop,
  Recycling,
  VolunteerActivism,
  Timeline,
  TrendingUp,
  Nature,
  Public,
  LocalFlorist,
  VerifiedUser,
} from '@mui/icons-material';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import NumberFlow, { continuous } from '@number-flow/react';
import { useInView } from 'react-intersection-observer';

export default function AboutPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const impactStats = [
    { 
      number: 15420, 
      label: 'Trees Planted',
      icon: <Forest sx={{ fontSize: '3rem' }} />,
      color: '#2e7d32'
    },
    { 
      number: 2840, 
      label: 'Volunteers Active',
      icon: <VolunteerActivism sx={{ fontSize: '3rem' }} />,
      color: '#1b5e20'
    },
    { 
      number: 186, 
      label: 'Events Completed',
      icon: <Group sx={{ fontSize: '3rem' }} />,
      color: '#4caf50'
    },
    { 
      number: 8962, 
      label: 'Pounds Recycled',
      icon: <Recycling sx={{ fontSize: '3rem' }} />,
      color: '#66bb6a'
    },
  ];

  const features = [
    {
      icon: <Nature sx={{ fontSize: '3rem', color: '#1b5e20' }} />,
      title: 'Environmental Impact',
      description: 'Making measurable positive changes to our environment through organized community action and sustainable practices.',
      gradient: '#2e7d32',
    },
    {
      icon: <Public sx={{ fontSize: '3rem', color: '#2e7d32' }} />,
      title: 'Global Community',
      description: 'Connecting environmental advocates worldwide to share knowledge, resources, and coordinate impactful initiatives.',
      gradient: 'linear-gradient(135deg, #2e7d32, #4caf50)',
    },
    {
      icon: <LocalFlorist sx={{ fontSize: '3rem', color: '#4caf50' }} />,
      title: 'Sustainable Growth',
      description: 'Fostering long-term environmental stewardship through education, innovation, and community engagement.',
      gradient: 'linear-gradient(135deg, #4caf50, #66bb6a)',
    },
    {
      icon: <VerifiedUser sx={{ fontSize: '3rem', color: '#66bb6a' }} />,
      title: 'Verified Impact',
      description: 'Transparent tracking and verification of environmental contributions to ensure accountability and celebrate achievements.',
      gradient: 'linear-gradient(135deg, #66bb6a, #81c784)',
    },
  ];

  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      bio: 'Environmental scientist with 10+ years in conservation',
      image: '/team/sarah.jpg',
      expertise: 'Climate Policy'
    },
    {
      name: 'Marcus Johnson',
      role: 'Technology Director',
      bio: 'Full-stack developer passionate about green technology',
      image: '/team/marcus.jpg',
      expertise: 'Green Tech'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Community Manager',
      bio: 'Community organizer building environmental movements',
      image: '/team/elena.jpg',
      expertise: 'Community Building'
    },
    {
      name: 'David Kim',
      role: 'Impact Analyst',
      bio: 'Data scientist measuring environmental outcomes',
      image: '/team/david.jpg',
      expertise: 'Data Science'
    },
  ];

  const milestones = [
    { year: '2020', title: 'Sproutify Founded', description: 'Started with a vision to democratize environmental action' },
    { year: '2021', title: '1K Volunteers', description: 'Reached our first thousand active environmental advocates' },
    { year: '2022', title: 'Global Expansion', description: 'Expanded to 15 countries with local environmental programs' },
    { year: '2023', title: '10K Trees Planted', description: 'Achieved milestone of 10,000 trees planted worldwide' },
    { year: '2024', title: 'Impact Verification', description: 'Launched blockchain-based impact verification system' },
  ];

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

        <Navbar />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
          {/* Hero Section */}
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', py: 8, mb: 8 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <EnergySavingsLeaf sx={{ fontSize: '4rem', color: '#2e7d32' }} />
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
                Cultivating a Greener Tomorrow
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
                Sproutify empowers communities worldwide to create lasting environmental impact through collaboration, technology, and verified action.
              </Typography>

              {/* Impact Statistics */}
              <Box ref={ref}>
                <Grid container spacing={4} justifyContent="center">
                  {impactStats.map((stat, index) => (
                    <Grid item xs={6} md={3} key={index}>
                      <Fade in={inView} timeout={800 + index * 200}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: '24px',
                            background: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <Box sx={{ color: stat.color, mb: 2 }}>
                            {stat.icon}
                          </Box>
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              fontWeight: 800,
                              color: stat.color,
                              mb: 1,
                              fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                          >
                            {inView && (
                              <NumberFlow
                                value={stat.number}
                                format={{ notation: 'compact' }}
                                transformTiming={{ duration: 2000, easing: 'ease-out' }}
                              />
                            )}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {stat.label}
                          </Typography>
                        </Paper>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Fade>

          {/* Features Section */}
          <Box sx={{ mb: 12 }}>
            <Typography 
              variant="h2" 
              align="center" 
              sx={{
                mb: 6,
                background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Our Mission
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Fade in timeout={1000 + index * 200}>
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
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: feature.gradient,
                        },
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.02)',
                          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ mb: 3 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Timeline Section */}
          <Box sx={{ mb: 12 }}>
            <Typography 
              variant="h2" 
              align="center" 
              sx={{
                mb: 6,
                background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Our Journey
            </Typography>
            
            <Box sx={{ position: 'relative', maxWidth: '800px', mx: 'auto' }}>
              {milestones.map((milestone, index) => (
                <Fade in timeout={1200 + index * 300} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      mb: 6,
                      position: 'relative',
                      '&::before': index < milestones.length - 1 ? {
                        content: '""',
                        position: 'absolute',
                        left: '60px',
                        top: '120px',
                        width: '2px',
                        height: '80px',
                        background: '#ffffff',
                      } : {},
                    }}
                  >
                    <Box
                      sx={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        mr: 4,
                        flexShrink: 0,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {milestone.year}
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        flex: 1,
                        borderRadius: '16px',
                        background: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Typography variant="h5" sx={{ color: 'primary.main', mb: 1, fontWeight: 600 }}>
                        {milestone.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {milestone.description}
                      </Typography>
                    </Paper>
                  </Box>
                </Fade>
              ))}
            </Box>
          </Box>

          {/* Team Section */}
          <Box sx={{ mb: 12 }}>
            <Typography 
              variant="h2" 
              align="center" 
              sx={{
                mb: 6,
                background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Meet Our Team
            </Typography>
            
            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Fade in timeout={1400 + index * 200}>
                    <Card
                      sx={{
                        borderRadius: '24px',
                        background: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Avatar
                          src={member.image}
                          sx={{
                            width: 120,
                            height: 120,
                            mx: 'auto',
                            mb: 3,
                            border: '4px solid #2e7d32',
                            background: '#ffffff',
                            fontSize: '3rem',
                          }}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography variant="h5" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                          {member.name}
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                          {member.role}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          {member.bio}
                        </Typography>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 1,
                            borderRadius: '12px',
                            background: 'rgba(0, 0, 0, 0.1)',
                            color: 'primary.main',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          {member.expertise}
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <Fade in timeout={1800}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '32px',
                background: '#2e7d32',
                color: 'white',
                p: 8,
                textAlign: 'center',
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
                <Typography variant="h2" sx={{ mb: 3, color: 'white' }}>
                  Ready to Make an Impact?
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
                  Join thousands of environmental advocates creating positive change
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: '1.2rem',
                    borderRadius: '16px',
                    background: '#ffffff',
                    color: '#1b5e20',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      background: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                  href="/register"
                >
                  Join Sproutify Today
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Container>
        <Footer />
      </Box>
  );
}
