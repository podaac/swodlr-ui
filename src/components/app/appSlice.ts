import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PageTypes } from '../../types/constantTypes'

// Define a type for the slice state
interface AppState {
  userAuthenticated: boolean,
  currentPage: PageTypes,
}

// Define the initial state using that type
const initialState: AppState = {
  userAuthenticated: false,
  currentPage: 'welcome'
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserAuthenticated: (state) => {
      state.userAuthenticated = true
    },
    setUserNotAuthenticated: (state) => {
      state.userAuthenticated = false
    },
    setCurrentPage: (state, action: PayloadAction<PageTypes>) => {
      state.currentPage = action.payload
  },
  },
})

export const { setUserAuthenticated, setUserNotAuthenticated, setCurrentPage } = appSlice.actions

export default appSlice.reducer