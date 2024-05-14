import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { allProductParameters } from '../../../types/constantTypes'
import { Product } from '../../../types/graphqlTypes'

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
    showCloseTutorialModal: boolean,
    showReGenerateProductModal: boolean,
}

// Define the initial state using that type
const initialState: AddCustomProductModalState = {
    showAddProductModal: false,
    showEditProductModal: false,
    showDeleteProductModal: false,
    showGenerateProductModal: false,
    showTutorialModal: false,
    skipTutorial: false,
    // allProducts: this will be like a 'database' for the local state of all the products added
    // the key will be cycleId_passId_sceneId and the value will be a 'parameterOptionDefaults' type object
    sampleGranuleDataArray: [],
    selectedGranules: [],
    showCloseTutorialModal: false,
    showReGenerateProductModal: false
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
    setShowReGenerateProductModalFalse: (state) => {
        state.showReGenerateProductModal = false
    },
    setShowReGenerateProductModalTrue: (state) => {
        state.showReGenerateProductModal = true
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
    },
    setShowCloseTutorialFalse: (state) => {
        state.showCloseTutorialModal = false
    },
    setShowCloseTutorialTrue: (state) => {
        state.showCloseTutorialModal = true
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
    setShowReGenerateProductModalFalse,
    setShowReGenerateProductModalTrue,
    setShowTutorialModalFalse,
    setShowTutorialModalTrue,
    setSkipTutorialFalse,
    setSkipTutorialTrue,
    setShowCloseTutorialFalse,
    setShowCloseTutorialTrue,
} = modalSlice.actions

export default modalSlice.reducer