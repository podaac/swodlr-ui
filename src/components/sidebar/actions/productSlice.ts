import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { allProductParameters } from '../../../types/constantTypes'

// Define a type for the slice state
interface GranuleState {
    sampleGranuleDataArray: number[],
    addedProducts: allProductParameters[],
    selectedGranules: string[]
}

// Define the initial state using that type
const initialState: GranuleState = {
    // allProducts: this will be like a 'database' for the local state of all the products added
    // the key will be cycleId_passId_sceneId and the value will be a 'parameterOptionDefaults' type object
    addedProducts: [],
    sampleGranuleDataArray: [],
    selectedGranules: []
}

export const productSlice = createSlice({
  name: 'productSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<allProductParameters>) => {
      state.addedProducts.push(Object.assign(action.payload))
      // add sample granule data
    },
    editProduct: (state, action: PayloadAction<allProductParameters>) => {
      const editedParameters = Object.assign(action.payload)
      const indexOfObjectToUpdate = state.addedProducts.findIndex(productObj => productObj.granuleId === editedParameters.granuleId)
      state.addedProducts[indexOfObjectToUpdate] = editedParameters
    },
    deleteProduct: (state, action: PayloadAction<string[]>) => {
        const productsToDelete: string[] = action.payload
        const newProductArray = [...state.addedProducts].filter(productObject => !productsToDelete.includes(productObject.granuleId))
        state.addedProducts = newProductArray
    },
    setSelectedGranules: (state, action: PayloadAction<string[]>) => {
      console.log(action.payload)
      state.selectedGranules = [...action.payload]
    }
  },
})

export const { 
    addProduct,
    editProduct,
    deleteProduct,
    setSelectedGranules
} = productSlice.actions

export default productSlice.reducer