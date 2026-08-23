"use client";

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Forest,
  Waves,
  Groups,
  Handshake,
} from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100vh' }}>
      <HeroSection />
      <ProblemSolutionSection />
      <ImpactSection />
      <ProcessSection />
      <PartnershipSection />
    </Box>
  );
}

function HeroSection() {
  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          backgroundImage: 'url("https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          backgroundImage: 'url("https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />
      <Container 
        maxWidth="md"
        sx={{ 
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem' },
            textShadow: '0px 4px 10px rgba(0,0,0,0.7)',
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          Bridging the Gap Between Community & Conservation.
        </Typography>
        <Typography
          variant="h5"
          sx={{
            maxWidth: '700px',
            mx: 'auto',
            mb: 4,
            fontWeight: 300,
            textShadow: '0px 2px 5px rgba(0,0,0,0.7)',
          }}
        >
          We empower volunteers to restore natural habitats through organized beach cleanups, reforestation projects, and community-led initiatives.
        </Typography>
        <Button
          component={Link}
          href="/events"
          variant="contained"
          size="large"
          sx={{
            px: 5,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: '50px',
            bgcolor: 'white',
            color: 'black',
            boxShadow: '0 4px 20px rgba(0,0,0, 0.2)',
            transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              bgcolor: '#f0f0f0',
            }
          }}
        >
          Get Involved
        </Button>
      </Container>
    </Box>
  );
}

function ProblemSolutionSection() {
  const sections = [
    {
      tag: "THE PROBLEM",
      title: "Our Coasts and Forests Are in Crisis.",
      description: "Tons of plastic waste choke our oceans, harming marine life. Simultaneously, deforestation destroys critical habitats. These issues demand urgent, large-scale collective action to protect our planet's future.",
      image: "https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      reverse: false,
    },
    {
      tag: "THE CHALLENGE",
      title: "Passion Without a Plan is Not Enough.",
      description: "Many people want to help, but individual efforts are often disconnected and inefficient. The greatest challenge is coordinating volunteer energy into focused, scientific, and sustainable restoration projects.",
      image: "https://images.pexels.com/photos/112782/pexels-photo-112782.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      reverse: true,
    },
    {
      tag: "THE OPPORTUNITY",
      title: "Harnessing the Power of Community.",
      description: "By providing a structured platform, we can channel this widespread passion into impactful projects like coordinated beach cleanups and strategic tree planting events, turning enthusiasm into tangible results.",
      image: "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      reverse: false,
    },
    {
      tag: "OUR SOLUTION",
      title: "Organized Action for Tangible Results.",
      description: "Sproutify connects volunteers with vetted environmental projects. We handle the logistics, so our community can focus on what matters: restoring our planet, one tree and one shoreline at a time.",
      image: "https://images.pexels.com/photos/4219175/pexels-photo-4219175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      reverse: true,
    },
  ];

  return (
    <Box sx={{ bgcolor: '#FDFCFB', py: { xs: 8, md: 12 } }}>
      {sections.map((section, index) => (
        <Container key={index} maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" direction={section.reverse ? 'row-reverse' : 'row'}>
            <Grid item xs={12} md={6}>
              <Box sx={{
                width: '100%',
                height: { xs: '300px', md: '450px' },
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
              }}>
                <Box 
                  component="img"
                  src={section.image}
                  alt={section.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                px: { md: 4 } 
              }}>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block', mb: 2 }}>
                  {section.tag}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Georgia", "serif"',
                    fontWeight: 'normal',
                    color: 'text.primary',
                    lineHeight: 1.3,
                    mb: 3,
                    fontSize: { xs: '2rem', md: '2.75rem' },
                  }}
                >
                  {section.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7 }}>
                  {section.description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      ))}
    </Box>
  );
}

function ImpactSection() {
  const stats = [
    { icon: <Waves fontSize="large" />, number: "50,000 lbs", label: "Debris Removed from Coasts" },
    { icon: <Forest fontSize="large" />, number: "120,000+", label: "Trees Planted Globally" },
    { icon: <Groups fontSize="large" />, number: "15,000+", label: "Active Volunteers" },
    { icon: <Handshake fontSize="large" />, number: "200+", label: "Community Partners" },
  ];

  return (
    <Box sx={{ py: 12, bgcolor: '#F4F8F4' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" color="text.secondary">Our Impact</Typography>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', fontFamily: '"Georgia", "serif"' }}>Making a Measurable Difference</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '750px', mx: 'auto' }}>
            Through thousands of volunteer hours, we've achieved significant milestones in environmental restoration and community building.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 4, 
                height: '100%', 
                borderRadius: 4,
                boxShadow: 'none',
                bgcolor: 'transparent',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                  bgcolor: 'white',
                }
              }}>
                <Box sx={{ 
                  mb: 2, 
                  display: 'inline-block',
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: 'rgba(46, 125, 50, 0.1)',
                }}>
                  {React.cloneElement(stat.icon, { sx: { color: 'primary.main', fontSize: 40 } })}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>{stat.number}</Typography>
                <Typography variant="body1" color="text.secondary">{stat.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function ProcessSection() {
  const steps = [
    { number: "01", title: "Identify & Plan", description: "We partner with local communities to identify critical areas for restoration, from polluted beaches to lands needing reforestation." },
    { number: "02", title: "Mobilize Volunteers", description: "Using our platform, we recruit and organize passionate volunteers, providing them with all the tools and training they need." },
    { number: "03", title: "Execute & Restore", description: "We manage on-the-ground events, ensuring every beach cleanup and tree planting project is safe, effective, and impactful." },
    { number: "04", title: "Measure & Repeat", description: "We track our collective impact—pounds of trash collected, trees planted—and use the data to plan future restoration efforts." },
  ];

  return (
    <Box sx={{ py: 12, bgcolor: 'background.paper', position: 'relative' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="overline" color="text.secondary">How It Works</Typography>
          <Typography variant="h2" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: '"Georgia", "serif"' }}>Our Four-Step Process</Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: '2px',
            bgcolor: 'grey.200',
            borderTop: '2px dashed #ccc',
            zIndex: 0,
            display: { xs: 'none', md: 'block' }
          }} />
          <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }} justifyContent={"center"}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={3} key={step.number}>
                <Card sx={{ 
                  p: 4, 
                  height: '100%', 
                  borderRadius: 4, 
                  bgcolor: '#F9F9F9',
                  boxShadow: 'none',
                  textAlign: 'center',
                  border: '1px solid #eee',
                }}>
                  <Typography variant="h2" color="primary.main" sx={{ fontWeight: 700, mb: 2 }}>{step.number}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>{step.title}</Typography>
                  <Typography color="text.secondary">{step.description}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function PartnershipSection() {
  return (
    <Box sx={{ py: 12, bgcolor: '#121212', color: 'white' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, fontFamily: '"Georgia", "serif"' }}>Partner With Us to Amplify Your Impact</Typography>
        <Typography variant="h6" sx={{ mb: 4, maxWidth: '800px', mx: 'auto', opacity: 0.8 }}>
          Whether you're a local community group, a corporation with sustainability goals, or an environmental organization, we can achieve more together.
        </Typography>
        <Button
          component={Link}
          href="/contact"
          variant="contained"
          size="large"
          sx={{
            px: 6,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: '50px',
            bgcolor: 'white',
            color: 'black',
            '&:hover': {
              bgcolor: 'grey.200',
            }
          }}
        >
          Become a Partner
        </Button>
      </Container>
    </Box>
  );
}