// src/store/navTitleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NavTitleState {
  title: string
}

const initialState: NavTitleState = {
  title: 'Workflow-Builder', // Initial title
}

const navTitleSlice = createSlice({
  name: 'navTitle',
  initialState,
  reducers: {
    setNavTitle(state, action: PayloadAction<string>) {
      state.title = action.payload
    },
  },
})

export const { setNavTitle } = navTitleSlice.actions

export default navTitleSlice.reducer
