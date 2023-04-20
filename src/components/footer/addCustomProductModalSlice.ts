import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'

// Define a type for the slice state
interface AddCustomProductModalState {
    showAddProductModal: boolean
}

// Define the initial state using that type
const initialState: AddCustomProductModalState = {
    showAddProductModal: false,
}

export const addCustomProductModalSlice = createSlice({
  name: 'addCustomProdutModal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFalse: (state) => {
        state.showAddProductModal = false
    },
    setTrue: (state) => {
        state.showAddProductModal = true
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    invert: (state) => {
        state.showAddProductModal = !state.showAddProductModal
    },
  },
})

export const { setFalse, setTrue, invert } = addCustomProductModalSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectShowAddProductModal = (state: RootState) => state.addCustomProductModal.showAddProductModal

export default addCustomProductModalSlice.reducer