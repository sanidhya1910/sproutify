'use client';

import React from 'react';
import Link from 'next/link';
import { 
  AppBar, 
  Toolbar,
  Box, 
  Typography, 
  Button,
  useScrollTrigger,
  Slide,
} from '@mui/material';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Clean Navbar Component matching Regeneration.enterprises style
function CleanNavbar() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: trigger ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          backdropFilter: trigger ? 'blur(10px)' : 'none',
          borderBottom: trigger ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid transparent',
          zIndex: 1300,
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, minHeight: '70px' }}>
          {/* Left Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { label: 'About', href: '/about' },
              { label: 'Events', href: '/events' },
              { label: 'Resources', href: '/resources' },
              { label: 'Contact', href: '/contact' }
            ].map((item) => (
              <Link 
                key={item.label}
                href={item.href} 
                style={{ textDecoration: 'none' }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: trigger ? '#333' : '#fff',
                    fontWeight: 500,
                    fontSize: '1rem',
                    '&:hover': {
                      color: '#2e7d32'
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item.label}
                </Typography>
              </Link>
            ))}
          </Box>

          {/* Center Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: trigger ? '#2e7d32' : '#fff',
                fontSize: '1.8rem',
                letterSpacing: '0.5px',
                transition: 'color 0.3s ease',
              }}
            >
              Sproutify
            </Typography>
            <Box 
              component="span"
              sx={{ 
                ml: 1,
                fontSize: '1.5rem',
                color: trigger ? '#2e7d32' : '#fff',
                transition: 'color 0.3s ease',
              }}
            >
              🌱
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                ml: 1,
                color: trigger ? '#666' : 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                transition: 'color 0.3s ease',
              }}
            >
              Begin again
            </Typography>
          </Link>

          {/* Right Get Started Button */}
          <Button
            component={Link}
            href="/register"
            variant="contained"
            sx={{
              background: '#2e7d32',
              color: 'white',
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(46, 125, 50, 0.2)',
              '&:hover': {
                background: '#1b5e20',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default function Navbar() {
  return <CleanNavbar />;
}
