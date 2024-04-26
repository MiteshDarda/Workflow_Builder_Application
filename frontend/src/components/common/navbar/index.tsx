import { useEffect, useState } from 'react'
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
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useDispatch, useSelector } from 'react-redux'
import { setNavTitle } from '../../../store/reducers/nav-title-slice'

const LeftNavbar = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const navigate = useNavigate()
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
          <button
            className="hover:bg-gray-200 hover:shadow-lg w-32 h-full px-8 py-5"
            onClick={() => {
              navigate('./')
              onClose()
            }}
          >
            Workflow Builder
          </button>
        </ListItem>
        <ListItem disablePadding>
          <button
            className="hover:bg-gray-200 hover:shadow-lg w-32 h-full px-8 py-5"
            onClick={() => {
              navigate('./run-workflow')
              onClose()
            }}
          >
            Run Workflow
          </button>
        </ListItem>
      </List>
    </Drawer>
  )
}

const Navbar = () => {
  const location = useLocation()

  const title = useSelector((state: any) => state.navTitle.title)
  const dispatch = useDispatch()

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(setNavTitle('Workflow-Builder'))
    } else if (location.pathname === '/run-workflow') {
      dispatch(setNavTitle('Run-Workflow'))
    }
  }, [location, dispatch])

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
          <Typography variant="h6">{title}</Typography>
          <LeftNavbar open={open} onClose={() => setOpen(false)} />
        </Toolbar>
      </AppBar>
      <Outlet />
    </div>
  )
}

export default Navbar
