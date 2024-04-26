// src/store/navTitleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ROUTE_TITLE } from '../../helper/constants'

interface NavTitleState {
  title: string
}

const initialState: NavTitleState = {
  title: 'Workflow-Builder', // Initial title
}

const navTitleSlice = createSlice({
  name: ROUTE_TITLE.BUILDER,
  initialState,
  reducers: {
    setNavTitle(state, action: PayloadAction<string>) {
      state.title = action.payload
    },
  },
})

export const { setNavTitle } = navTitleSlice.actions

export default navTitleSlice.reducer
