import { purple  } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0d47a1',
    },
    secondary: {
      main: '#c3c3c3',
    },
    background: {
      default: '#08233f',
    },
    error: {
      main: purple.A400,
    },
  },
});

export default theme;