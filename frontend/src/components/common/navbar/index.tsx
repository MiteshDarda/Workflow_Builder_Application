import { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Drawer,
  List,
  ListItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useDispatch, useSelector } from 'react-redux'
import { setNavTitle } from '../../../store/reducers/nav-title-slice'
import { ROUTES, ROUTE_TITLE } from '../../../helper/constants'

const LeftNavbar = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const navigate = useNavigate()
  return (
    <Drawer anchor="left" variant={'temporary'} open={open} onClose={onClose}>
      <List disablePadding>
        <ListItem disablePadding>
          <Tooltip title="Close">
            <button
              className="hover:bg-gray-200 hover:shadow-lg w-32 h-full px-8 py-5"
              onClick={onClose}
            >
              <ArrowBackIosNewIcon />
            </button>
          </Tooltip>
        </ListItem>
        <ListItem disablePadding>
          <button
            className="hover:bg-gray-200 hover:shadow-lg w-32 h-full px-8 py-5"
            onClick={() => {
              navigate('.' + ROUTES.BUILDER)
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
              navigate('.' + ROUTES.RUN_WORKFLOW)
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
    if (location.pathname === ROUTES.BUILDER) {
      dispatch(setNavTitle(ROUTE_TITLE.BUILDER))
    } else if (location.pathname === ROUTES.RUN_WORKFLOW) {
      dispatch(setNavTitle(ROUTE_TITLE.RUN_WORKFLOW))
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
