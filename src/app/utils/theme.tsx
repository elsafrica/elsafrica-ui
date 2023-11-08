'use client'
import React from 'react';
import { lightGreen, lightBlue, yellow } from '@mui/material/colors'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: lightGreen[400],
      dark: lightGreen[800],
      light: lightGreen[200],
      contrastText: lightBlue[50],
    },
    warning: {
      main: yellow[800],
      contrastText: '#000'
    }
  },
});

function Themify({
  children
} : {
  children: React.ReactNode
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Themify
