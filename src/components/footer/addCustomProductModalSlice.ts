import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { allProductParameters } from '../../types/constantTypes'

// Define a type for the slice state
interface AddCustomProductModalState {
    showAddProductModal: boolean,
    allProductParametersArray: allProductParameters[]
}

// Define the initial state using that type
const initialState: AddCustomProductModalState = {
    showAddProductModal: false,
    // allProducts: this will be like a 'database' for the local state of all the products added
    // the key will be cycleId_passId_sceneId and the value will be a 'parameterOptionDefaults' type object
    allProductParametersArray: []
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
    addProduct: (state, action: PayloadAction<allProductParameters>) => {
        state.allProductParametersArray.push(Object.assign(action.payload))
    }
  },
})

export const { setFalse, setTrue, invert, addProduct } = addCustomProductModalSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectShowAddProductModal = (state: RootState) => state.addCustomProductModal.showAddProductModal

export default addCustomProductModalSlice.reducer