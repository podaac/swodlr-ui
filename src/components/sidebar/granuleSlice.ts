import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { allProductParameters } from '../../types/constantTypes'

// Define a type for the slice state
interface GranuleState {
    allGranulesParametersArray: allProductParameters[],
    sampleGranuleDataArray: number[]
}

// Define the initial state using that type
const initialState: GranuleState = {
    // allProducts: this will be like a 'database' for the local state of all the products added
    // the key will be cycleId_passId_sceneId and the value will be a 'parameterOptionDefaults' type object
    allGranulesParametersArray: [],
    sampleGranuleDataArray: []
}

export const granuleSlice = createSlice({
  name: 'addCustomProdutModal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addGranule: (state, action: PayloadAction<allProductParameters>) => {
      console.log(action.payload)
        state.allGranulesParametersArray.push(Object.assign(action.payload))
        // add sample granule data

    }
  },
})

export const { 
    addGranule
} = granuleSlice.actions

export default granuleSlice.reducer