import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AlertMessageObject, allProductParameters, GeneratedProduct, GenerateProductParameters, MapFocusObject, RetrievedDataHistory, SpatialSearchResult } from '../../../types/constantTypes'
import L, { LatLngExpression } from 'leaflet'
import { parameterOptionDefaults } from '../../../constants/rasterParameterConstants'
import { v4 as uuidv4 } from 'uuid';
import { generateL2RasterProduct } from '../../../user/userData';
import { Product } from '../../../types/graphqlTypes';

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
    spatialSearchStartDate: string,
    spatialSearchEndDate: string,
    mapFocus: MapFocusObject,
    historyPageState: string[],
    historyPageIndex: number,
    firstHistoryPageData: Product[],
    userProducts: Product[]
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
    mapFocus: {center: [33.854457, -118.709093], zoom: 6},
    generatedProducts: [],
    generateProductParameters: generateProductParametersFiltered,
    granuleTableAlerts: [],
    productCustomizationTableAlerts: [],
    showUTMAdvancedOptions: false,
    spatialSearchResults: [],
    waitingForSpatialSearch: false,
    spatialSearchStartDate: (new Date(2022, 11, 16)).toISOString(),
    spatialSearchEndDate: (new Date()).toISOString(),
    userProducts: [],
    historyPageState: [],
    firstHistoryPageData: [],
    historyPageIndex: 0
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
      state.mapFocus = {center: [centerOfFootprint.lat, centerOfFootprint.lng], zoom: 7}
    },
    setMapFocus: (state, action: PayloadAction<MapFocusObject>) => {
      state.mapFocus = action.payload
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
      if (!state.granuleTableAlerts.find(alertObj => alertObj.message === action.payload.message)) {
        state.granuleTableAlerts = [...state.granuleTableAlerts, action.payload]
      }
    },
    removeGranuleTableAlerts: (state, action: PayloadAction<string>) => {
      const newAlerts = state.granuleTableAlerts.filter(alertObject => alertObject.type !== action.payload)
      state.granuleTableAlerts = newAlerts
    },
    clearGranuleTableAlerts: (state) => {
      state.granuleTableAlerts = []
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
    setSpatialSearchStartDate: (state, action: PayloadAction<string>) => {
      state.spatialSearchStartDate = action.payload
    },
    setSpatialSearchEndDate: (state, action: PayloadAction<string>) => {
      state.spatialSearchEndDate = action.payload
    },
    addPageToHistoryPageState: (state, action: PayloadAction<string>) => {
      const idInHistory = state.historyPageState.includes(action.payload)
      if (!idInHistory) {
        state.historyPageState = [...state.historyPageState, action.payload]
      }
    },
    setHistoryPageState: (state, action: PayloadAction<number>) => {
      state.historyPageIndex = action.payload
    },
    setFirstHistoryPageData: (state, action: PayloadAction<Product[]>) => {
      state.firstHistoryPageData = action.payload
    },
    setUserProducts: (state, action: PayloadAction<Product[]>) => {
      state.userProducts = action.payload
    }
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
    setSpatialSearchStartDate,
    setSpatialSearchEndDate,
    setMapFocus,
    clearGranuleTableAlerts,
    setUserProducts,
    setFirstHistoryPageData,
    setHistoryPageState,
    addPageToHistoryPageState,
} = productSlice.actions

export default productSlice.reducer