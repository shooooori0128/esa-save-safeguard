import { createTheme } from '@mui/material';

const baseFontFamily = ['"Yusei Magic"', 'Arial', 'sans-serif'];

export default createTheme({
  palette: {
    mode: 'dark',
  },

  typography: {
    fontFamily: baseFontFamily.join(','),
  },
});
