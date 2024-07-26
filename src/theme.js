import { purple  } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F0F0F0',
    },
    secondary: {
      main: '#5957FF',
    },
    background: {
      default: '#141414',
    },
    error: {
      main: purple.A400,
    },
  },
});

export default theme;