import { Drawer, List, ListItem, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { ROUTES } from '../../../../helper/constants'

export const LeftNavbar = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  //$ Constants.
  const navigate = useNavigate()

  //$ JSX .
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
