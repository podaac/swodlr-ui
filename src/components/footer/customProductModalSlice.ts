import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { allProductParameters } from '../../types/constantTypes'

// Define a type for the slice state
interface AddCustomProductModalState {
    showAddProductModal: boolean,
    showEditProductModal: boolean,
    showDeleteProductModal: boolean,
    showGenerateProductModal: boolean,
    allProductParametersArray: allProductParameters[],
    sampleGranuleDataArray: number[]
}

// Define the initial state using that type
const initialState: AddCustomProductModalState = {
    showAddProductModal: false,
    showEditProductModal: false,
    showDeleteProductModal: false,
    showGenerateProductModal: false,
    // allProducts: this will be like a 'database' for the local state of all the products added
    // the key will be cycleId_passId_sceneId and the value will be a 'parameterOptionDefaults' type object
    allProductParametersArray: [],
    sampleGranuleDataArray: []
}

export const customProductModalSlice = createSlice({
  name: 'addCustomProdutModal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setShowAddProductModalFalse: (state) => {
        state.showAddProductModal = false
    },
    setShowAddProductModalTrue: (state) => {
        state.showAddProductModal = true
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    invertShowAddProductModal: (state) => {
        state.showAddProductModal = !state.showAddProductModal
    },
    addProduct: (state, action: PayloadAction<allProductParameters>) => {
        state.allProductParametersArray.push(Object.assign(action.payload))
        // add sample granule data

    },
    setShowEditProductModalFalse: (state) => {
        state.showEditProductModal = false
    },
    setShowEditProductModalTrue: (state) => {
        state.showEditProductModal = true
    },
    editProduct: (state, action: PayloadAction<allProductParameters>) => {
        const editedParameters = Object.assign(action.payload)
        const indexOfObjectToUpdate = state.allProductParametersArray.findIndex(productObj => productObj.granuleId === editedParameters.granuleId)
        state.allProductParametersArray[indexOfObjectToUpdate] = editedParameters
    },
    deleteProduct: (state, action: PayloadAction<string[]>) => {
        const productsToDelete: string[] = action.payload
        const newProductArray = [...state.allProductParametersArray].filter(productObject => !productsToDelete.includes(productObject.granuleId))
        state.allProductParametersArray = newProductArray
    },
    setShowDeleteProductModalFalse: (state) => {
        state.showDeleteProductModal = false
    },
    setShowDeleteProductModalTrue: (state) => {
        state.showDeleteProductModal = true
    },
    setShowGenerateProductModalFalse: (state) => {
        state.showGenerateProductModal = false
    },
    setShowGenerateProductModalTrue: (state) => {
        state.showGenerateProductModal = true
    },
  },
})

export const { 
    setShowAddProductModalFalse, 
    setShowAddProductModalTrue, 
    invertShowAddProductModal, 
    addProduct, 
    setShowEditProductModalFalse,
    setShowEditProductModalTrue,
    editProduct,
    deleteProduct,
    setShowDeleteProductModalFalse,
    setShowDeleteProductModalTrue,
    setShowGenerateProductModalFalse,
    setShowGenerateProductModalTrue
} = customProductModalSlice.actions

export default customProductModalSlice.reducer