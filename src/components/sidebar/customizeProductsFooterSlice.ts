import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mouseLocation } from '../../types/customizeProductsFooterTypes'

// Define a type for the slice state
interface CustomizeProductsFooterState {
    footerResizeActive: boolean,
    resizeStartLocation: mouseLocation,
    resizeEndLocation: mouseLocation,
    footerMinimized: boolean
}

// Define the initial state using that type
const initialState: CustomizeProductsFooterState = {
    footerResizeActive: false,
    resizeStartLocation: {
        left: 0,
        top: 0
    },
    resizeEndLocation: {
        left: 0,
        top: 0
    },
    footerMinimized: false
}

export const customizeProductsFooterSlice = createSlice({
  name: 'addCustomProdutModal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setResizeInactive: (state) => {
        state.footerResizeActive = false
    },
    setResizeActive: (state) => {
        state.footerResizeActive = true
    },
    setResizeStartLocation: (state, action: PayloadAction<mouseLocation>) => {
        state.resizeStartLocation = Object.assign(action.payload)
    },
    setResizeEndLocation: (state, action: PayloadAction<mouseLocation>) => {
        state.resizeEndLocation = Object.assign(action.payload)
    },
    setFooterMinimized: (state) => {
        state.footerMinimized = true
    },
    setFooterExpanded: (state) => {
        state.footerMinimized = false
    },
  },
})

export const { 
    setResizeInactive, 
    setResizeActive, 
    setResizeStartLocation, 
    setResizeEndLocation, 
    setFooterMinimized, 
    setFooterExpanded 
} = customizeProductsFooterSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectShowAddProductModal = (state: RootState) => state.addCustomProductModal.showAddProductModal

export default customizeProductsFooterSlice.reducer