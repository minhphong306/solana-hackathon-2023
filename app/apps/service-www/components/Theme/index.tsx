import { createTheme } from '@mui/material/styles';

export const CustomTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#8E86DB',
      dark: '#4D2EA5',
    },
    secondary: {
      main: '#4D2EA5',
      dark: '#3F337B',
    },
    background: {
      default: '#150e3a',
      paper: '#271E57',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#5049BB',
    },
    tierColor: {
      common: '#606467',
      uncommon: '#3CA503',
      rare: '#016EE7',
      epic: '#8A38C8',
      mythical: '#BD2A1A',
      legendary: '#F46D01',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#271E57',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#5C4ABA',
          },
          '&:hover': {
            backgroundColor: '#5C4ABA',
          },
        },
      },
    },
  },
});
