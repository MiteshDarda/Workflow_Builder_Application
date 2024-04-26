// store/reducers/index.ts
import { combineReducers } from '@reduxjs/toolkit'
import navTitleSlice from './nav-title-slice'

const rootReducer = combineReducers({
  navTitle: navTitleSlice,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
