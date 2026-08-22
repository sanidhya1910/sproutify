'use client';

import React from 'react';
import { Box, Container, Typography, Link as MuiLink, IconButton, Grid } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#1C1C1C', color: 'white', py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5} justifyContent="space-between">
          <Grid item xs={12} sm={4} md={5}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontFamily: '"Georgia", "serif"' }}>
              Sproutify
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', maxWidth: '350px' }}>
              Bridging the gap between community and conservation through volunteer-led environmental action.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Georgia", "serif"' }}>
              Navigate
            </Typography>
            <MuiLink component={Link} href="/about" color="inherit" display="block" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>About Us</MuiLink>
            <MuiLink component={Link} href="/events" color="inherit" display="block" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>Events</MuiLink>
            <MuiLink component={Link} href="/contact" color="inherit" display="block" sx={{ '&:hover': { color: 'primary.main' } }}>Contact</MuiLink>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Georgia", "serif"' }}>
              Engage
            </Typography>
            <MuiLink component={Link} href="/resources" color="inherit" display="block" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>Resources</MuiLink>
            <MuiLink component={Link} href="/volunteer/events" color="inherit" display="block" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>Volunteer</MuiLink>
            <MuiLink component={Link} href="/register" color="inherit" display="block" sx={{ '&:hover': { color: 'primary.main' } }}>Get Started</MuiLink>
          </Grid>
          <Grid item xs={12} sm={2} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Georgia", "serif"' }}>
              Follow Us
            </Typography>
            <Box>
              <IconButton href="#" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><Facebook /></IconButton>
              <IconButton href="#" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><Twitter /></IconButton>
              <IconButton href="#" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><Instagram /></IconButton>
              <IconButton href="#" color="inherit" sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><LinkedIn /></IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #444', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            © {new Date().getFullYear()} Sproutify. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
