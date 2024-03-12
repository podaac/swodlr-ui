import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AddCustomProductModalState {
    showAddProductModal: boolean,
    showEditProductModal: boolean,
    showDeleteProductModal: boolean,
    showGenerateProductModal: boolean,
    sampleGranuleDataArray: number[],
    selectedGranules: string[],
    showTutorialModal: boolean,
    skipTutorial: boolean,
}

// Define the initial state using that type
const initialState: AddCustomProductModalState = {
    showAddProductModal: false,
    showEditProductModal: false,
    showDeleteProductModal: false,
    showGenerateProductModal: false,
    showTutorialModal: false,
    skipTutorial: true,
    // allProducts: this will be like a 'database' for the local state of all the products added
    // the key will be cycleId_passId_sceneId and the value will be a 'parameterOptionDefaults' type object
    sampleGranuleDataArray: [],
    selectedGranules: []
}

export const modalSlice = createSlice({
  name: 'modalSlice',
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
    setShowEditProductModalFalse: (state) => {
        state.showEditProductModal = false
    },
    setShowEditProductModalTrue: (state) => {
        state.showEditProductModal = true
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
    setShowTutorialModalFalse: (state) => {
        state.showTutorialModal = false
    },
    setShowTutorialModalTrue: (state) => {
        state.showTutorialModal = true
    },
    setSkipTutorialFalse: (state) => {
        state.skipTutorial = false
    },
    setSkipTutorialTrue: (state) => {
        state.skipTutorial = true
    }
  },
})

export const { 
    setShowAddProductModalFalse, 
    setShowAddProductModalTrue, 
    invertShowAddProductModal, 
    setShowEditProductModalFalse,
    setShowEditProductModalTrue,
    setShowDeleteProductModalFalse,
    setShowDeleteProductModalTrue,
    setShowGenerateProductModalFalse,
    setShowGenerateProductModalTrue,
    setShowTutorialModalFalse,
    setShowTutorialModalTrue,
    setSkipTutorialFalse,
    setSkipTutorialTrue
} = modalSlice.actions

export default modalSlice.reducer