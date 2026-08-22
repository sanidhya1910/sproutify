"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Paper,
  Fade,
  Chip,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  MenuBook,
  ExpandMore,
  Water,
  RecyclingOutlined,
  Forest,
  CleaningServices,
  Computer,
  CheckCircle,
  Info,
  Lightbulb,
  Warning,
} from '@mui/icons-material';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const guides = [
  {
    id: 'beach-cleanup',
    title: 'Beach Cleanup Guide',
    icon: <CleaningServices sx={{ fontSize: '2rem' }} />,
    color: '#2e7d32',
    gradient: 'linear-gradient(135deg, #2e7d32, #4caf50)',
    description: 'Complete guide to organizing effective beach cleanup events',
    sections: [
      { 
        title: "Preparation", 
        type: 'preparation',
        content: "Identify polluted beaches, gather volunteers, get permission from local authorities, and arrange cleaning tools like gloves, bags, and bins.",
        tips: [
          "Contact local environmental agencies for permits",
          "Create volunteer registration system",
          "Prepare safety briefing materials",
          "Coordinate with waste management services"
        ]
      },
      { 
        title: "Safety Measures", 
        type: 'safety',
        content: "Ensure volunteers wear gloves and closed shoes, provide first aid kits, and stay hydrated throughout the event.",
        tips: [
          "Mandatory safety gear for all participants",
          "Set up hydration stations",
          "Have trained first aid personnel",
          "Establish emergency contact protocols"
        ]
      },
      { 
        title: "Cleanup Process", 
        type: 'process',
        content: "Start from one end, collect segregated waste (plastic, metal, glass, etc.), and dispose of it responsibly in bins or recycling centers.",
        tips: [
          "Use color-coded collection bags",
          "Document waste types and quantities",
          "Take before/after photos",
          "Work systematically across the area"
        ]
      },
      { 
        title: "After Cleanup", 
        type: 'followup',
        content: "Celebrate and appreciate volunteers, post impact stats on social media, and share learnings for future drives.",
        tips: [
          "Calculate total waste collected",
          "Share impact metrics with community",
          "Gather feedback for improvement",
          "Plan regular follow-up cleanups"
        ]
      }
    ]
  },
  {
    id: 'tree-plantation',
    title: 'Tree Plantation Guide',
    icon: <Forest sx={{ fontSize: '2rem' }} />,
    color: '#1b5e20',
    gradient: '#2e7d32',
    description: 'Step-by-step guide for successful tree planting initiatives',
    sections: [
      { 
        title: "Preparation", 
        type: 'preparation',
        content: "Choose native tree species, prepare land, gather saplings, spades, watering cans, and protective gear.",
        tips: [
          "Research native species suitable for the climate",
          "Test soil quality and pH levels",
          "Plan spacing for mature tree growth",
          "Ensure adequate water source availability"
        ]
      },
      { 
        title: "Safety Measures", 
        type: 'safety',
        content: "Educate about proper lifting, digging depth, and avoid harsh tools for children participants.",
        tips: [
          "Provide age-appropriate tools",
          "Teach proper lifting techniques",
          "Supervise children at all times",
          "Avoid planting during extreme weather"
        ]
      },
      { 
        title: "Plantation Process", 
        type: 'process',
        content: "Dig appropriate pits, plant saplings, water them, and apply compost or mulch around the base.",
        tips: [
          "Dig holes 2-3 times the root ball width",
          "Remove saplings from containers gently",
          "Water immediately after planting",
          "Apply organic mulch to retain moisture"
        ]
      },
      { 
        title: "Care and Maintenance", 
        type: 'followup',
        content: "Assign groups to maintain plants for the next 6–12 months with regular watering and protection.",
        tips: [
          "Create maintenance schedule",
          "Install protective barriers if needed",
          "Monitor for pests and diseases",
          "Celebrate milestones and growth"
        ]
      }
    ]
  },
  {
    id: 'waste-management',
    title: 'Waste Management Guide',
    icon: <RecyclingOutlined sx={{ fontSize: '2rem' }} />,
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50, #66bb6a)',
    description: 'Comprehensive approach to sustainable waste management',
    sections: [
      { 
        title: "Understanding Waste", 
        type: 'preparation',
        content: "Learn to differentiate between biodegradable, non-biodegradable, and hazardous waste.",
        tips: [
          "Educate community on waste categories",
          "Create visual guides for waste sorting",
          "Understand local recycling capabilities",
          "Identify hazardous waste disposal sites"
        ]
      },
      { 
        title: "Segregation", 
        type: 'process',
        content: "Use color-coded bins: green for wet, blue for dry, red for hazardous. Educate communities.",
        tips: [
          "Place clear labels on all bins",
          "Conduct regular community workshops",
          "Monitor and provide feedback",
          "Reward proper segregation practices"
        ]
      },
      { 
        title: "Composting", 
        type: 'process',
        content: "Encourage home/community composting using kitchen waste for soil enrichment.",
        tips: [
          "Provide composting bins to households",
          "Teach proper composting ratios",
          "Monitor temperature and moisture",
          "Use finished compost in community gardens"
        ]
      },
      { 
        title: "Recycling", 
        type: 'followup',
        content: "Partner with recyclers for paper, plastic, metal, and glass. Avoid sending recyclables to landfills.",
        tips: [
          "Establish partnerships with recycling centers",
          "Create collection schedules",
          "Track recycling quantities",
          "Explore upcycling opportunities"
        ]
      }
    ]
  },
  {
    id: 'ewaste-disposal',
    title: 'E-Waste Disposal Guide',
    icon: <Computer sx={{ fontSize: '2rem' }} />,
    color: '#66bb6a',
    gradient: 'linear-gradient(135deg, #66bb6a, #81c784)',
    description: 'Safe and responsible electronic waste disposal practices',
    sections: [
      { 
        title: "Awareness", 
        type: 'preparation',
        content: "Understand the harm caused by improper disposal of electronic waste.",
        tips: [
          "Learn about toxic materials in electronics",
          "Understand environmental impact",
          "Educate community about e-waste dangers",
          "Promote responsible consumption"
        ]
      },
      { 
        title: "Collection Drives", 
        type: 'process',
        content: "Organize e-waste collection camps for households, offices, and schools.",
        tips: [
          "Partner with schools and offices",
          "Advertise collection dates widely",
          "Provide incentives for participation",
          "Ensure secure data destruction"
        ]
      },
      { 
        title: "Safe Disposal", 
        type: 'process',
        content: "Tie up with government-authorized recyclers for dismantling and proper disposal.",
        tips: [
          "Verify recycler certifications",
          "Ensure proper dismantling processes",
          "Track disposal certificates",
          "Avoid informal sector disposal"
        ]
      },
      { 
        title: "Upcycling", 
        type: 'followup',
        content: "Promote reuse or donation of functional electronics to schools or NGOs.",
        tips: [
          "Test functionality before donation",
          "Partner with educational institutions",
          "Create refurbishment programs",
          "Extend product lifecycles"
        ]
      }
    ]
  },
  {
    id: 'water-conservation',
    title: 'Water Conservation Guide',
    icon: <Water sx={{ fontSize: '2rem' }} />,
    color: '#29b6f6',
    gradient: 'linear-gradient(135deg, #29b6f6, #42a5f5)',
    description: 'Effective strategies for water conservation and management',
    sections: [
      { 
        title: "Assessment", 
        type: 'preparation',
        content: "Evaluate local water usage, leakages, and opportunities to save water.",
        tips: [
          "Conduct water audits in buildings",
          "Identify and fix leakages",
          "Monitor consumption patterns",
          "Assess rainwater harvesting potential"
        ]
      },
      { 
        title: "Techniques", 
        type: 'process',
        content: "Install aerators, use rainwater harvesting, and promote drip irrigation for plants.",
        tips: [
          "Install low-flow fixtures",
          "Set up rainwater collection systems",
          "Use greywater for non-potable uses",
          "Implement smart irrigation systems"
        ]
      },
      { 
        title: "Community Action", 
        type: 'process',
        content: "Organize workshops, water audits, and awareness drives for responsible use.",
        tips: [
          "Conduct educational workshops",
          "Create water conservation pledges",
          "Organize community challenges",
          "Share water-saving tips regularly"
        ]
      },
      { 
        title: "Long-Term Strategy", 
        type: 'followup',
        content: "Collaborate with authorities to restore water bodies and push sustainable policies.",
        tips: [
          "Advocate for policy changes",
          "Participate in watershed restoration",
          "Support sustainable development",
          "Monitor water quality regularly"
        ]
      }
    ]
  }
];

const ResourceDetailPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const getStepIcon = (type) => {
    switch (type) {
      case 'preparation': return <Info sx={{ color: '#1976d2' }} />;
      case 'safety': return <Warning sx={{ color: '#f57c00' }} />;
      case 'process': return <CheckCircle sx={{ color: '#388e3c' }} />;
      case 'followup': return <Lightbulb sx={{ color: '#7b1fa2' }} />;
      default: return <Lightbulb sx={{ color: '#616161' }} />;
    }
  };

  return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'white',
        }}
      >

        <Navbar />
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header Section */}
          <Fade in timeout={600}>
            <Box sx={{ textAlign: 'center', py: 8, mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <MenuBook sx={{ fontSize: '4rem', color: '#2e7d32' }} />
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
                Environmental Guides
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
                Comprehensive step-by-step guides for sustainable environmental activities and initiatives
              </Typography>
            </Box>
          </Fade>

          {/* Guide Categories */}
          <Fade in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '24px',
                background: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    minHeight: 80,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 4,
                    borderRadius: '4px 4px 0 0',
                    background: '#ffffff',
                  },
                }}
              >
                {guides.map((guide, index) => (
                  <Tab
                    key={index}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: guide.color }}>
                          {guide.icon}
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {guide.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {guide.sections.length} steps
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ p: 3 }}
                  />
                ))}
              </Tabs>

              {/* Guide Content */}
              <Box sx={{ p: 6 }}>
                {guides.map((guide, index) => (
                  <Box key={index} sx={{ display: activeTab === index ? 'block' : 'none' }}>
                    <Fade in={activeTab === index} timeout={600}>
                      <Box>
                        {/* Guide Header */}
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              p: 3,
                              borderRadius: '50%',
                              background: guide.gradient,
                              color: 'white',
                              mb: 3,
                              boxShadow: `0 8px 24px ${alpha(guide.color, 0.3)}`,
                            }}
                          >
                            {guide.icon}
                          </Box>
                          <Typography variant="h3" sx={{ mb: 2, color: 'primary.main' }}>
                            {guide.title}
                          </Typography>
                          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                            {guide.description}
                          </Typography>
                        </Box>

                        {/* Guide Steps */}
                        <Grid container spacing={4}>
                          {guide.sections.map((section, sectionIndex) => (
                            <Grid item xs={12} key={sectionIndex}>
                              <Fade in timeout={800 + sectionIndex * 200}>
                                <Accordion
                                  defaultExpanded={sectionIndex === 0}
                                  sx={{
                                    borderRadius: '16px !important',
                                    background: '#ffffff',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                                    '&:before': { display: 'none' },
                                    mb: 2,
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    sx={{
                                      '& .MuiAccordionSummary-content': {
                                        alignItems: 'center',
                                        gap: 2,
                                      },
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: 40,
                                          height: 40,
                                          borderRadius: '50%',
                                          background: alpha(guide.color, 0.1),
                                          color: guide.color,
                                          fontWeight: 800,
                                          fontSize: '1.2rem',
                                        }}
                                      >
                                        {sectionIndex + 1}
                                      </Box>
                                      <Box>
                                        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                          {section.title}
                                        </Typography>
                                        <Chip
                                          icon={getStepIcon(section.type)}
                                          label={section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                                          size="small"
                                          sx={{
                                            mt: 0.5,
                                            background: alpha(guide.color, 0.1),
                                            color: guide.color,
                                            border: `1px solid ${alpha(guide.color, 0.3)}`,
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  </AccordionSummary>
                                  <AccordionDetails sx={{ pt: 0 }}>
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        mb: 3, 
                                        lineHeight: 1.7,
                                        color: 'text.primary',
                                        fontSize: '1.1rem',
                                      }}
                                    >
                                      {section.content}
                                    </Typography>
                                    
                                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                                      Key Tips:
                                    </Typography>
                                    <List dense>
                                      {section.tips.map((tip, tipIndex) => (
                                        <ListItem key={tipIndex} sx={{ py: 0.5 }}>
                                          <ListItemIcon sx={{ minWidth: 36 }}>
                                            <CheckCircle sx={{ color: guide.color, fontSize: '1.2rem' }} />
                                          </ListItemIcon>
                                          <ListItemText 
                                            primary={tip}
                                            sx={{
                                              '& .MuiListItemText-primary': {
                                                color: 'text.primary',
                                                lineHeight: 1.6,
                                              },
                                            }}
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </AccordionDetails>
                                </Accordion>
                              </Fade>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Fade>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Fade>

          {/* CTA Section */}
          <Fade in timeout={1400}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '32px',
                background: '#2e7d32',
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
                  Ready to Take Action?
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
                  Use these guides to organize impactful environmental initiatives in your community
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Box
                      component="a"
                      href="/events"
                      sx={{
                        display: 'inline-block',
                        py: 2,
                        px: 4,
                        borderRadius: '12px',
                        background: '#ffffff',
                        color: '#1b5e20',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      View Events
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      component="a"
                      href="/contact"
                      sx={{
                        display: 'inline-block',
                        py: 2,
                        px: 4,
                        borderRadius: '12px',
                        border: '2px solid rgba(255, 255, 255, 0.9)',
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#ffffff',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Get Support
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Fade>
        </Container>
        <Footer />
      </Box>
  );
};

export default ResourceDetailPage;
