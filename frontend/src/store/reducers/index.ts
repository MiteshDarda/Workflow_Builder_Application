import { combineReducers } from '@reduxjs/toolkit'
import navTitleSlice from './nav-title-slice'
import messageReducer from './message-slice'

const rootReducer = combineReducers({
  navTitle: navTitleSlice,
  message: messageReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
