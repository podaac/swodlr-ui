import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mouseLocation } from '../../../types/sidebarTypes'
import { TabTypes } from '../../../types/constantTypes'

// Define a type for the slice state
interface CustomizeProductsFooterState {
    footerResizeActive: boolean,
    resizeStartLocation: mouseLocation,
    resizeEndLocation: mouseLocation,
    footerMinimized: boolean
    activeTab: TabTypes,
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
    footerMinimized: false,
    activeTab: 'productCustomization'
}

export const sidebarSlice = createSlice({
  name: 'sidebarSlice',
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
    setActiveTab: (state, action: PayloadAction<TabTypes>) => {
        state.activeTab = action.payload
    },
  },
})

export const { 
    setResizeInactive, 
    setResizeActive, 
    setResizeStartLocation, 
    setResizeEndLocation, 
    setFooterMinimized, 
    setFooterExpanded,
    setActiveTab
} = sidebarSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectShowAddProductModal = (state: RootState) => state.addCustomProductModal.showAddProductModal

export default sidebarSlice.reducer