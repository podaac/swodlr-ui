import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PageTypes } from '../../types/constantTypes'
import { CurrentUser } from '../../types/graphqlTypes'

// Define a type for the slice state
interface AppState {
  userAuthenticated: boolean,
  currentPage: PageTypes,
  currentUser: CurrentUser
}

// Define the initial state using that type
const initialState: AppState = {
  userAuthenticated: false,
  currentPage: 'welcome',
  currentUser: {id: '', email: '', firstName: '', lastName: ''}
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
    setCurrentUser: (state, action: PayloadAction<CurrentUser>) => {
      state.currentUser = action.payload
    },
  },
})

export const { setUserAuthenticated, setUserNotAuthenticated, setCurrentPage, setCurrentUser } = appSlice.actions

export default appSlice.reducer