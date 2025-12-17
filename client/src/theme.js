import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Indigo (Brand Color)
      light: '#818cf8',
      dark: '#4f46e5',
    },
    // CHANGED: From Pink to Teal
    secondary: {
  main: '#f59e0b', // Amber/Orange
  light: '#fcd34d',
  dark: '#d97706',
},
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { fontWeight: 600, textTransform: 'none', borderRadius: 12 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          padding: '10px 24px',
          boxShadow: 'none',
          fontSize: '1rem',
          '&:hover': { boxShadow: '0 10px 20px -10px rgba(99, 102, 241, 0.5)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0px 10px 40px -10px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        },
      },
    },
  },
});

export default theme;