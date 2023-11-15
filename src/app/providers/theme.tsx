'use client'
import React from 'react';
import { lightGreen, green, yellow } from '@mui/material/colors'
import { ThemeProvider, createTheme } from '@mui/material/styles';

declare module "@mui/material/styles" {
  interface Palette {
    whatsapp: {
      main: string;
      dark?: string;
      light?: string;
      contrastText?: string;
    };
  }
  interface PaletteOptions {
    whatsapp: {
      main: string;
      dark?: string;
      light?: string;
      contrastText?: string;
    };
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    whatsapp: true;
  }
}

const { palette } = createTheme();
const theme = createTheme({
  palette: {
    primary: {
      main: lightGreen[400],
      dark: lightGreen[800],
      light: lightGreen[200],
      contrastText: '#fff',
    },
    warning: {
      main: yellow[800],
      contrastText: '#000'
    },
    whatsapp: {
      main: '#2bb741',
      contrastText: '#fff',
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
