import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Snackbar } from '@mui/material'
import { clearMessage } from '../../../store/reducers/message-slice'
import { RootState } from '../../../store/reducers'

export default function Background() {
  //* Message .
  const [messageProgress, setMessageProgress] = useState(0)
  const messageType = useSelector(
    (state: RootState) => state.message.messageType,
  )
  const messageText = useSelector(
    (state: RootState) => state.message.messageText,
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (messageType || messageText) {
      const timer = setInterval(() => {
        setMessageProgress((prevProgress: any) => prevProgress + 1)
      }, 50)
      return () => {
        clearInterval(timer)
      }
    } else {
      setMessageProgress(0)
    }
  }, [messageType, messageText])

  useEffect(() => {
    if (messageProgress >= 100) {
      handleClose()
      setMessageProgress(0)
    }
  }, [messageProgress])

  const handleClose = () => {
    dispatch(clearMessage())
  }

  return (
    <Box position="absolute" top={0} width="100%" zIndex={9999}>
      <Snackbar open={!!messageType} onClose={handleClose}>
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={messageType || 'error'}
        >
          {messageText}
        </Alert>
      </Snackbar>
    </Box>
  )
}
