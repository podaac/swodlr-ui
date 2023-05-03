import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AppState {
  userAuthenticated: boolean,
}

// Define the initial state using that type
const initialState: AppState = {
  userAuthenticated: false,
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
    }
  },
})

export const { setUserAuthenticated, setUserNotAuthenticated } = appSlice.actions

export default appSlice.reducer