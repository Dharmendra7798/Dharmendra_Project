import { createTheme } from '@mui/material/styles';
import { red, blueGrey } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5', // Blue
    },
    secondary: {
      main: '#ff9800', // Orange
    },
    error: {
      main: red.A400,
    },
    background: {
      default: blueGrey[50],
    },
  },
  typography: {
    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;