import React, { useContext } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Box,
} from '@material-ui/core';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontFamily: 'Poppins',
        fontSize: '1.5rem',
        fontWeight: 700,
        margin: '1rem 0',
      },
      h2: {
        fontFamily: 'Poppins',
        fontSize: '1.1rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h3: {
        fontFamily: 'Poppins',
        fontSize: '1rem',
        fontWeight: 400,
      },
      body1: {
        fontWeight: 'normal',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#64E294',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  const classes = useStyles();
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Manuka Store` : 'Manuka Store'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>manuka.Store</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href="/cart" passHref>
                <Link>cart</Link>
              </NextLink>
              <NextLink href="/login" passHref>
                <Link>login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <div style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', p: 1 }}>
              <Box sx={{ p: 1 }}>Item 1</Box>
              <Box sx={{ p: 1 }}>Item 2</Box>
              <Box sx={{ p: 1 }}>Item 3</Box>
            </Box>
          </div>
          <Typography>© 2021 manuka.Store</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
