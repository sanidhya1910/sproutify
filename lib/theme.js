import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2d5016', // Deep forest green
      light: '#4a7c59', // Light forest green
      dark: '#1c3310', // Dark forest green
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e3a8a', // Deep ocean blue
      light: '#3b82f6', // Light ocean blue
      dark: '#1e40af', // Dark ocean blue
      contrastText: '#ffffff',
    },
    success: {
      main: '#2d5016', // Forest green
      light: '#4a7c59',
      dark: '#1c3310',
    },
    info: {
      main: '#1e3a8a', // Ocean blue
      light: '#3b82f6',
      dark: '#1e40af',
    },
    warning: {
      main: '#4a7c59', // Light forest green for warnings
      light: '#4a7c59',
      dark: '#2d5016',
    },
    error: {
      main: '#1e3a8a', // Ocean blue for errors
      light: '#3b82f6',
      dark: '#1e40af',
    },
    background: {
      default: '#ffffff', // Pure white background
      paper: '#ffffff', // Pure white paper
    },
    text: {
      primary: '#000000', // Pure black text
      secondary: '#000000', // Pure black text
      disabled: '#666666',
    },
    divider: 'rgba(45, 80, 22, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 800,
      lineHeight: 1.1,
      background: 'linear-gradient(135deg, #000000, #2e7d32)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.02em',
      '@media (max-width:900px)': {
        fontSize: '3rem',
      },
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#000000',
      letterSpacing: '-0.01em',
      '@media (max-width:900px)': {
        fontSize: '2.5rem',
      },
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#000000',
      '@media (max-width:600px)': {
        fontSize: '1.8rem',
      },
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#000000',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#000000',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#000000',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
      color: '#666666',
      fontWeight: 400,
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#666666',
      fontWeight: 400,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 20,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(0, 0, 0, 0.08)',
    '0px 4px 12px rgba(0, 0, 0, 0.1)',
    '0px 8px 24px rgba(0, 0, 0, 0.12)',
    '0px 12px 32px rgba(0, 0, 0, 0.15)',
    '0px 16px 40px rgba(0, 0, 0, 0.18)',
    '0px 20px 48px rgba(0, 0, 0, 0.2)',
    '0px 24px 56px rgba(0, 0, 0, 0.22)',
    ...Array(17).fill('0px 24px 56px rgba(0, 0, 0, 0.22)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#ffffff',
          minHeight: '100vh',
          fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid rgba(46, 125, 50, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
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
            background: '#2e7d32',
          },
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
            background: '#ffffff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '14px 28px',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
          overflow: 'hidden',
          letterSpacing: '0.01em',
        },
        contained: {
          background: '#2e7d32',
          boxShadow: '0 8px 24px rgba(46, 125, 50, 0.25)',
          color: '#ffffff',
          border: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover': {
            background: '#1b5e20',
            transform: 'translateY(-3px)',
            boxShadow: '0 16px 32px rgba(46, 125, 50, 0.35)',
            '&::before': {
              left: '100%',
            },
          },
        },
        outlined: {
          border: '2px solid #2e7d32',
          color: '#2e7d32',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#2e7d32',
            color: '#ffffff',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(46, 125, 50, 0.2)',
          },
        },
        text: {
          color: '#2e7d32',
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.08)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          border: '1px solid rgba(46, 125, 50, 0.1)',
          borderRadius: '20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            fontSize: '1rem',
            '& fieldset': {
              borderColor: 'rgba(46, 125, 50, 0.3)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(46, 125, 50, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2e7d32',
              borderWidth: '2px',
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#2e4a2e',
            fontSize: '1rem',
            '&.Mui-focused': {
              color: '#2e7d32',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(46, 125, 50, 0.1)',
          boxShadow: '0 4px 20px rgba(27, 94, 32, 0.08)',
          color: '#1b5e20',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
        filled: {
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          color: '#1b5e20',
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.15)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgba(27, 94, 32, 0.05)',
            color: '#1b5e20',
            fontWeight: 600,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '&.MuiAlert-standardSuccess': {
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            color: '#1b5e20',
          },
        },
      },
    },
  },
});

export default theme;
