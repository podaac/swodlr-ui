import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AlertMessageObject, allProductParameters, GeneratedProduct, GenerateProductParameters, SpatialSearchResult } from '../../../types/constantTypes'
import L, { LatLngExpression } from 'leaflet'
import { parameterOptionDefaults } from '../../../constants/rasterParameterConstants'
import { v4 as uuidv4 } from 'uuid';
import { generateL2RasterProduct } from '../../../user/userData';

// Define a type for the slice state
interface GranuleState {
    sampleGranuleDataArray: number[],
    addedProducts: allProductParameters[],
    selectedGranules: string[],
    granuleFocus: number[],
    generatedProducts: GeneratedProduct[],
    generateProductParameters: GenerateProductParameters,
    granuleTableAlerts: AlertMessageObject[],
    productCustomizationTableAlerts: AlertMessageObject[],
    showUTMAdvancedOptions: boolean,
    spatialSearchResults: SpatialSearchResult[],
    waitingForSpatialSearch: boolean,
    waitingForFootprintSearch: boolean,
    spatialSearchStartDate: string,
    spatialSearchEndDate: string
}

const {name, cycle, pass, scene, ...generateProductParametersFiltered } = parameterOptionDefaults

// Define the initial state using that type
const initialState: GranuleState = {
    // allProducts: this will be like a 'database' for the local state of all the products added
    // the key will be cycleId_passId_sceneId and the value will be a 'parameterOptionDefaults' type object
    addedProducts: [],
    sampleGranuleDataArray: [],
    selectedGranules: [],
    granuleFocus: [33.854457, -118.709093],
    generatedProducts: [],
    generateProductParameters: generateProductParametersFiltered,
    granuleTableAlerts: [],
    productCustomizationTableAlerts: [],
    showUTMAdvancedOptions: false,
    spatialSearchResults: [],
    waitingForSpatialSearch: false,
    waitingForFootprintSearch: false,
    spatialSearchStartDate: (new Date()).toString(),
    spatialSearchEndDate: (new Date()).toString()
}


export const productSlice = createSlice({
  name: 'productSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<allProductParameters[]>) => {
      action.payload.forEach(granuleObjectToAdd => state.addedProducts.push(Object.assign(granuleObjectToAdd)))
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
      const footprintToFocus = state.addedProducts.find(addedGranule => addedGranule.granuleId === granuleIdToFocus)!.footprint as LatLngExpression[]
      const centerOfFootprint = L.polygon(footprintToFocus).getBounds().getCenter()
      state.granuleFocus = [centerOfFootprint.lat, centerOfFootprint.lng]
    },
    addGeneratedProducts: (state, action: PayloadAction<string[]>) => {
      const productsToBeGeneratedCopy = [...action.payload]

      const newGeneratedProducts: GeneratedProduct[] = productsToBeGeneratedCopy.map((granuleId, index) => {
        const relevantAddedProduct = state.addedProducts.find(productObj => productObj.granuleId === granuleId) as allProductParameters
        const {utmZoneAdjust, mgrsBandAdjust, cycle, pass, scene} = relevantAddedProduct
        const {outputGranuleExtentFlag, outputSamplingGridType, rasterResolutionUTM, rasterResolutionGEO} = state.generateProductParameters
        const rasterResolution = outputSamplingGridType === "utm" ? rasterResolutionUTM : rasterResolutionGEO
        const fetchData = async () => {
          await generateL2RasterProduct(cycle, pass, scene, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, utmZoneAdjust, mgrsBandAdjust)
        }
        
        fetchData().catch(console.error);

        return ({
          productId: uuidv4(),
          granuleId: granuleId, 
          status: index % 2 === 0 ? "In Progress" : "Complete", 
          cycle,
          pass,
          scene,
          parametersUsedToGenerate: {
            batchGenerateProductParameters: state.generateProductParameters,
            utmZoneAdjust: utmZoneAdjust,
            mgrsBandAdjust: mgrsBandAdjust
          },
          downloadUrl: `https://test-download-url-${granuleId}.zip`,
          dateGenerated: new Date(),
        })
      })
      state.generatedProducts = [...state.generatedProducts, ...newGeneratedProducts]
    },
    setGenerateProductParameters: (state, action: PayloadAction<GenerateProductParameters>) => {
      state.generateProductParameters = action.payload
    },
    addGranuleTableAlerts: (state, action: PayloadAction<AlertMessageObject>) => {
      const newAlert = action.payload
      if (state.granuleTableAlerts.map(alertObj => alertObj.message).includes(newAlert.message)) {
        // alert already in there so just up the time for that alert
      } else {
        // alert not in there yet so add it and start with the default time
        state.granuleTableAlerts = [...state.granuleTableAlerts, newAlert]
      }
    },
    removeGranuleTableAlerts: (state, action: PayloadAction<string>) => {
      const newAlerts = [...state.granuleTableAlerts].filter(alertObject => alertObject.type !== action.payload)
      state.granuleTableAlerts = newAlerts
    },
    setShowUTMAdvancedOptions: (state, action: PayloadAction<boolean>) => {
      state.showUTMAdvancedOptions = action.payload
    },
    addSpatialSearchResults: (state, action: PayloadAction<SpatialSearchResult[]>) => {
      state.spatialSearchResults = action.payload
    },
    setWaitingForSpatialSearch: (state, action: PayloadAction<boolean>) => {
      state.waitingForSpatialSearch = action.payload
    },
    setWaitingForFootprintSearch: (state, action: PayloadAction<boolean>) => {
      state.waitingForFootprintSearch = action.payload
    },
    setSpatialSearchStartDate: (state, action: PayloadAction<string>) => {
      state.spatialSearchStartDate = action.payload
    },
    setSpatialSearchEndDate: (state, action: PayloadAction<string>) => {
      state.spatialSearchEndDate = action.payload
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
    setGenerateProductParameters,
    addGranuleTableAlerts,
    removeGranuleTableAlerts,
    setShowUTMAdvancedOptions,
    addSpatialSearchResults,
    setWaitingForSpatialSearch,
    setWaitingForFootprintSearch,
    setSpatialSearchStartDate,
    setSpatialSearchEndDate
} = productSlice.actions

export default productSlice.reducer