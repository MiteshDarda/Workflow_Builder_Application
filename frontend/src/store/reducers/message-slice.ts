import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for message types
type MessageType = 'error' | 'warning' | 'success'

interface MessageState {
  messageType: MessageType | null
  messageText: string
}

const initialState: MessageState = {
  messageType: null,
  messageText: '',
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (
      state,
      action: PayloadAction<{ type: MessageType; text: string }>,
    ) => {
      state.messageType = action.payload.type
      state.messageText = action.payload.text
    },
    clearMessage: (state) => {
      state.messageType = null
      state.messageText = ''
    },
  },
})

export const { setMessage, clearMessage } = messageSlice.actions
export default messageSlice.reducer
