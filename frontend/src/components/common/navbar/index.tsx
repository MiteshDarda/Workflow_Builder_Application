import { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Toolbar, Typography } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setNavTitle } from '../../../store/reducers/nav-title-slice'
import { ROUTES, ROUTE_TITLE } from '../../../helper/constants'
import { LeftNavbar } from './helper/LeftNavbar'

const Navbar = () => {
  //$ Constants .
  const location = useLocation()
  const title = useSelector((state: any) => state.navTitle.title)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  //$ Functions .
  const handleToggle = () => {
    setOpen(!open)
  }

  //$ Use Effects .
  // This handles the nav redux
  useEffect(() => {
    if (location.pathname === ROUTES.BUILDER) {
      dispatch(setNavTitle(ROUTE_TITLE.BUILDER))
    } else if (location.pathname === ROUTES.RUN_WORKFLOW) {
      dispatch(setNavTitle(ROUTE_TITLE.RUN_WORKFLOW))
    }
  }, [location, dispatch])

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
