import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Drawer,
  List,
  ListItem,
  Toolbar,
  Typography,
} from '@mui/material'
import { Outlet } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const LeftNavbar = ({
  open,
  onClose,
}: {
  open: boolean
  onClose?: () => void
}) => {
  return (
    <Drawer anchor="left" variant={'persistent'} open={open} onClose={onClose}>
      <List disablePadding>
        <ListItem disablePadding>
          <button
            className="hover:bg-gray-200 hover:shadow-lg w-32 h-full px-8 py-5"
            onClick={onClose}
          >
            <ArrowBackIosNewIcon />
          </button>
        </ListItem>
        <ListItem disablePadding>
          <button className="hover:bg-gray-200 hover:shadow-lg w-32 h-full px-8 py-5">
            Workflow Builder
          </button>
        </ListItem>
        <ListItem disablePadding>
          <button className="hover:bg-gray-200 hover:shadow-lg w-32 h-full px-8 py-5">
            Run Workflow
          </button>
        </ListItem>
      </List>
    </Drawer>
  )
}

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const handleToggle = () => {
    setOpen(!open)
  }
  return (
    <div className="h-screen w-screen">
      <AppBar
        position="fixed"
        sx={{ width: '80vw', left: '10vw', top: '10px', borderRadius: '1rem' }}
      >
        <Toolbar>
          <IconButton onClick={handleToggle} sx={{ marginRight: '0.5rem' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Your App Name</Typography>
          <LeftNavbar open={open} onClose={() => setOpen(false)} />
        </Toolbar>
      </AppBar>
      <Outlet />
    </div>
  )
}

export default Navbar
