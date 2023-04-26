import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface NavbarState {
    darkMode: boolean,
    colorModeClass: string
}

// Define the initial state using that type
const initialState: NavbarState = {
    darkMode: true,
    colorModeClass: 'dark-mode'
}

export const navbarSlice = createSlice({
  name: 'navbar',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setDarkMode: (state) => {
        state.darkMode = true
        state.colorModeClass = 'dark-mode'
    },
    setLightMode: (state) => {
        state.darkMode = false
        state.colorModeClass = 'light-mode'
    }
  },
})

export const { setDarkMode, setLightMode } = navbarSlice.actions

export default navbarSlice.reducer