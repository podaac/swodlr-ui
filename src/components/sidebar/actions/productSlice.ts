import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { allProductParameters, generatedProduct, GenerateProductParameters } from '../../../types/constantTypes'
import L, { LatLngExpression } from 'leaflet'
import { parameterOptionDefaults } from '../../../constants/rasterParameterConstants'

// Define a type for the slice state
interface GranuleState {
    sampleGranuleDataArray: number[],
    addedProducts: allProductParameters[],
    selectedGranules: string[],
    granuleFocus: LatLngExpression,
    generatedProducts: generatedProduct[],
    generateProductParameters: GenerateProductParameters
}

const {name, cycle, pass, scene, ...generateProductParametersFiltered } = parameterOptionDefaults

// Define the initial state using that type
const initialState: GranuleState = {
    // allProducts: this will be like a 'database' for the local state of all the products added
    // the key will be cycleId_passId_sceneId and the value will be a 'parameterOptionDefaults' type object
    addedProducts: [],
    sampleGranuleDataArray: [],
    selectedGranules: [],
    granuleFocus: [33.854457, -118.709093] as LatLngExpression,
    generatedProducts: [],
    generateProductParameters: generateProductParametersFiltered
}


export const productSlice = createSlice({
  name: 'productSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<allProductParameters[]>) => {
      action.payload.forEach(granuleObjectToAdd => state.addedProducts.push(Object.assign(granuleObjectToAdd)))
      // state.addedProducts.push(Object.assign(action.payload))
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
      state.selectedGranules = [...action.payload]
    },
    setGranuleFocus: (state, action: PayloadAction<string>) => {
      const granuleIdToFocus = action.payload
      const footprintToFocus = state.addedProducts.find(addedGranule => addedGranule.granuleId === granuleIdToFocus)!.footprint
      const centerOfFootprint = L.polygon(footprintToFocus).getBounds().getCenter()
      state.granuleFocus = centerOfFootprint as LatLngExpression
    },
    addGeneratedProducts: (state, action: PayloadAction<string[]>) => {
      const productsToBeGeneratedCopy = [...action.payload]
      const newGeneratedProducts: generatedProduct[] = productsToBeGeneratedCopy.map((granuleId, index) => ({granuleId: granuleId, status: index % 2 === 0 ? "IN_PROGRESS" : "COMPLETE", parametersUsedToGenerate: state.generateProductParameters}))
      state.generatedProducts = [...state.generatedProducts, ...newGeneratedProducts]
    },
    setGenerateProductParameters: (state, action: PayloadAction<GenerateProductParameters>) => {
      state.generateProductParameters = action.payload
    },
  },
})

export const { 
    addProduct,
    editProduct,
    deleteProduct,
    setSelectedGranules,
    setGranuleFocus,
    addGeneratedProducts,
    setGenerateProductParameters
} = productSlice.actions

export default productSlice.reducer