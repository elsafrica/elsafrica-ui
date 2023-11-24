'use client'
import React, { useContext } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import MenuListComposition from './MenuList';
import { ContextUpdater } from '../providers/context';
import { Bubblegum_Sans as Bubblegum } from 'next/font/google'

interface Link {
  name: string;
  to: string;
}

interface Page {
  name: string;
  linkContains: string;
  items: Link[]
}

const montserrat = Bubblegum({ subsets: ['latin'], weight: '400' });

const Header = () => {

  const pages: Page[] = [
    {
      name: 'Customer',
      linkContains: 'customer',
      items: [
        {
          name: 'New Customer',
          to: '/customers/new'
        }, 
        {
          name: 'Customer Accounts',
          to: '/customers/list'
        },
        {
          name: 'Customer Uploads',
          to: '/customers/upload'
        }
      ]
    },
    {
      name: 'Account Status',
      linkContains: 'account',
      items: [
        {
          name: 'Due Accounts',
          to: '/accounts/due'
        }, {
          name: 'Overdue Accounts',
          to: '/accounts/overdue'
        },
        {
          name: 'Suspended Accounts',
          to: '/accounts/suspended'
        },
        {
          name: 'Accrued Accounts',
          to: '/accounts/accrued'
        }
      ]
    },
    {
      name: 'WhatsApp',
      linkContains: 'whatsapp',
      items: [
        {
          name: 'WhatsApp Login',
          to: '/whatsapp_login'
        },
      ]
    },
    {
      name: 'Assets',
      linkContains: 'assets',
      items: [
        {
          name: 'Create Asset',
          to: '/assets/new'
        },
        {
          name: 'List Assets',
          to: '/assets/list'
        },
      ]
    },
    {
      name: 'Packages',
      linkContains: 'packages',
      items: [
        {
          name: 'Create Package',
          to: '/masters/packages/new'
        },
        {
          name: 'List Packages',
          to: '/masters/packages/list'
        },
      ]
    }
  ];
  const settings = [
    {
      name: 'Logout',
      to: '/sign_in'
    }
  ];
  const { updateAuthToken } = useContext(ContextUpdater);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{
      backgroundColor: '#91d000'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 1200,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              fontSize: '2rem'
            }}
            className={montserrat.className}
          >
            Elsafrica Networks
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {/* {pages.map((page) => (
                <Link href={page.to} key={page.name} style={{ textDecoration: 'none', color: 'black' }}>
                  <MenuItem key={page.name} onClick={handleCloseNavMenu} sx={{
                    width: { xs: '250px' }
                  }}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                </Link>
              ))} */}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 1200,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              fontSize: '2rem'
            }}
            className={montserrat.className}
          >
            Elsafrica Networks
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', paddingRight: '2rem' } }} justifyContent='flex-end'>
            {pages.map((page) => (
              <MenuListComposition key={page.name} parentName={page.name} linkContains={page.linkContains} list={page.items}/>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Ian Kariuki" src="/ian-kariuki" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <Link href={setting.to} onClick={() => {if(setting.name === 'Logout') updateAuthToken('')}} key={setting.name} style={{ textDecoration: 'none', color: 'black' }}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;