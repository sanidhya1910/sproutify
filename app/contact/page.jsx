"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Fade,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  alpha,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Send,
  ContactMail,
  Support,
  Business,
  Schedule,
} from '@mui/icons-material';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      subject: '',
      phone: '',
      message: '',
      consent: false,
    });
  };

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: '2rem' }} />,
      title: 'Email Us',
      description: 'Get in touch via email',
      value: 'hello@sproutify.org',
      color: '#1b5e20',
    },
    {
      icon: <Phone sx={{ fontSize: '2rem' }} />,
      title: 'Call Us',
      description: 'Speak with our team',
      value: '+1 (555) 123-4567',
      color: '#2e7d32',
    },
    {
      icon: <LocationOn sx={{ fontSize: '2rem' }} />,
      title: 'Visit Us',
      description: 'Our headquarters',
      value: '123 Green Street, Eco City, EC 12345',
      color: '#4caf50',
    },
    {
      icon: <Schedule sx={{ fontSize: '2rem' }} />,
      title: 'Office Hours',
      description: 'When we\'re available',
      value: 'Mon-Fri: 9AM-6PM PST',
      color: '#66bb6a',
    },
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
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
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
                  <ContactMail sx={{ fontSize: '4rem', color: 'white' }} />
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
                Get in Touch
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
                Have questions about environmental initiatives? Want to collaborate? We'd love to hear from you.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid item xs={12} md={5}>
              <Fade in timeout={800}>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4,
                      color: 'primary.main',
                      fontWeight: 600,
                    }}
                  >
                    Contact Information
                  </Typography>

                  <Grid container spacing={3}>
                    {contactInfo.map((info, index) => (
                      <Grid item xs={12} key={index}>
                        <Fade in timeout={1000 + index * 200}>
                          <Card
                            sx={{
                              borderRadius: '20px',
                              background: '#ffffff',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                              },
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    background: alpha(info.color, 0.1),
                                    color: info.color,
                                    mr: 3,
                                  }}
                                >
                                  {info.icon}
                                </Box>
                                <Box>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: 'primary.main',
                                      fontWeight: 600,
                                      mb: 0.5,
                                    }}
                                  >
                                    {info.title}
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: 'text.secondary',
                                      mb: 1,
                                    }}
                                  >
                                    {info.description}
                                  </Typography>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      color: 'text.primary',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {info.value}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Additional Info Card */}
                  <Fade in timeout={1800}>
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 4,
                        p: 4,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                        color: 'white',
                        textAlign: 'center',
                      }}
                    >
                      <Support sx={{ fontSize: '2.5rem', mb: 2 }} />
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        24/7 Community Support
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Our global community is here to help with environmental questions and collaboration opportunities.
                      </Typography>
                    </Paper>
                  </Fade>
                </Box>
              </Fade>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Fade in timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    borderRadius: '28px',
                    background: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #2e7d32, #4caf50)',
                      borderRadius: '28px 28px 0 0',
                    },
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4,
                      color: 'primary.main',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Send us a Message
                  </Typography>

                  {submitted && (
                    <Fade in>
                      <Alert 
                        severity="success" 
                        sx={{ 
                          mb: 4,
                          borderRadius: '12px',
                          '& .MuiAlert-icon': {
                            fontSize: '1.5rem',
                          },
                        }}
                      >
                        Thank you for your message! We'll get back to you within 24 hours.
                      </Alert>
                    </Fade>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number (Optional)"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          name="message"
                          multiline
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          placeholder="Tell us about your environmental initiative, question, or how we can help..."
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="consent"
                              checked={formData.consent}
                              onChange={handleChange}
                              required
                              sx={{ color: 'primary.main' }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              I agree to the privacy policy and terms of service
                            </Typography>
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={isSubmitting || !formData.consent}
                          startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                          sx={{
                            py: 2,
                            fontSize: '1.1rem',
                            borderRadius: '16px',
                            position: 'relative',
                          }}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </Box>
  );
};

export default ContactPage;
