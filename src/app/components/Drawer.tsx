import React from 'react'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Link from 'next/link'
import { AccountBox, AccountBalanceWallet, Inventory, WhatsApp, Devices } from '@mui/icons-material'
import { usePathname } from 'next/navigation'

interface Link {
  name: string;
  to: string;
}

interface Page {
  name: string;
  linkContains: string;
  items: Link[]
}

const Drawer = ({
  open,
  pages,
  onClose
} : {
  open: boolean,
  pages: Page[],
  onClose: () => void,
}) => {
  const pathname = usePathname();
  
  const renderListItemIcon = (linkName: string) : React.ReactNode => {
    switch (linkName.toLowerCase()) {
      case 'customer':
        return <AccountBox />
      case 'account status':
        return <AccountBalanceWallet />
      case 'whatsapp':
        return <WhatsApp />
      case 'assets':
        return <Devices />
      case 'packages':
        return <Inventory />
      default:
        return <></>
    }
  };
  
  return (
    <MuiDrawer
      anchor='left'
      open={open}
      onClose={onClose}
    >
      {
        pages.map((page: Page, index: number) => (
          <>
            <List
              key={page.name}
              subheader={
                <ListSubheader>{page.name.substring(0, 1).toUpperCase()}{page.name.substring(1)}</ListSubheader>
              }
            >
              {
                page.items.map((link: Link) => (
                  <Link href={link.to} style={{ textDecoration: 'none', color: 'unset' }} key={link.to}>
                    <ListItemButton selected={pathname.includes(link.to)}>
                      <ListItemIcon>
                        {renderListItemIcon(page.name)}
                      </ListItemIcon>
                      <ListItemText>{link.name}</ListItemText>
                    </ListItemButton>
                  </Link>
                ))
              }
            </List>
            { index < pages.length - 1 && <Divider /> }
          </>
        ))
      }
    </MuiDrawer>
  )
}

export default Drawer