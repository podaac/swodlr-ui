import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AlertMessageObject, allProductParameters, GeneratedProduct, GenerateProductParameters, MapFocusObject, SpatialSearchResult } from '../../../types/constantTypes'
import L, { LatLngExpression } from 'leaflet'
import { defaultFilterParameters, defaultSpatialSearchEndDate, defaultSpatialSearchStartDate, parameterOptionDefaults, parameterOptionValues } from '../../../constants/rasterParameterConstants'
import { v4 as uuidv4 } from 'uuid';
import { generateL2RasterProduct } from '../../../user/userData';
import { Product } from '../../../types/graphqlTypes';
import { FilterParameters} from '../../../types/historyPageTypes';

// Define a type for the slice state
interface GranuleState {
    sampleGranuleDataArray: number[],
    addedProducts: allProductParameters[],
    selectedGranules: string[],
    granuleFocus: number[],
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
    userProducts: Product[],
    allUserProducts: Product[],
    currentFilters: FilterParameters,
    granulesToReGenerate: Product[],
    waitingForMyDataFiltering: boolean,
    waitingForMyDataFilteringReset: boolean,
    waitingForProductsToLoad: boolean
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
    generateProductParameters: generateProductParametersFiltered,
    granuleTableAlerts: [],
    productCustomizationTableAlerts: [],
    showUTMAdvancedOptions: false,
    spatialSearchResults: [],
    waitingForSpatialSearch: false,
    spatialSearchStartDate: defaultSpatialSearchStartDate.toISOString(),
    spatialSearchEndDate: defaultSpatialSearchEndDate.toISOString(),
    userProducts: [],
    allUserProducts: [],
    historyPageState: [],
    firstHistoryPageData: [],
    historyPageIndex: 0,
    currentFilters: defaultFilterParameters,
    granulesToReGenerate: [],
    waitingForMyDataFiltering: false,
    waitingForMyDataFilteringReset: false,
    waitingForProductsToLoad: false
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
    addGeneratedProducts: (state, action: PayloadAction<{granuleIds: string[], typeOfGenerate: 'generate' | 're-generate'}>) => {
      action.payload.granuleIds.forEach(granuleId => {
        if(action.payload.typeOfGenerate === 'generate') {
          const relevantAddedProduct = state.addedProducts.find(productObj => productObj.granuleId === granuleId) as allProductParameters
          const { cycle, pass, scene} = relevantAddedProduct
          const utmZoneAdjust = relevantAddedProduct.utmZoneAdjust ?? parameterOptionValues.utmZoneAdjust.default
          const mgrsBandAdjust = relevantAddedProduct.mgrsBandAdjust ?? parameterOptionValues.mgrsBandAdjust.default
          const {outputGranuleExtentFlag, outputSamplingGridType, rasterResolutionUTM, rasterResolutionGEO} = state.generateProductParameters
          const rasterResolution = outputSamplingGridType === "utm" ? rasterResolutionUTM : rasterResolutionGEO
          const fetchData = async () => {
            await generateL2RasterProduct(cycle, pass, scene, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, utmZoneAdjust, mgrsBandAdjust)
          }
          fetchData().catch(console.error);
        } else if(action.payload.typeOfGenerate === 're-generate') {
          const relevantAddedProduct = state.granulesToReGenerate.find(productObj => productObj.id === granuleId) as Product
          const {cycle, pass, scene, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, utmZoneAdjust, mgrsBandAdjust} = relevantAddedProduct

          let utmZoneAdjustToUse = String(utmZoneAdjust ?? parameterOptionValues.utmZoneAdjust.default)
          if(utmZoneAdjustToUse === '1') utmZoneAdjustToUse = "+1"
          let mgrsBandAdjustToUse = String(mgrsBandAdjust ?? parameterOptionValues.mgrsBandAdjust.default)
          if(mgrsBandAdjustToUse === '1') mgrsBandAdjustToUse = "+1"

          const fetchData = async () => {
            await generateL2RasterProduct(String(cycle), String(pass), String(scene), +outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, utmZoneAdjustToUse, mgrsBandAdjustToUse)
          }
          fetchData().catch(console.error);
        }
      })
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
    },
    setAllUserProducts: (state, action: PayloadAction<Product[]>) => {
      state.allUserProducts = action.payload
    },
    setCurrentFilter: (state, action: PayloadAction<FilterParameters>) => {
      state.currentFilters = action.payload
    },
    setGranulesToReGenerate: (state, action: PayloadAction<Product[]>) => {
      state.granulesToReGenerate = action.payload
    },
    setWaitingForMyDataFiltering: (state, action: PayloadAction<boolean>) => {
      state.waitingForMyDataFiltering = action.payload
    },
    setWaitingForMyDataFilteringReset: (state, action: PayloadAction<boolean>) => {
      state.waitingForMyDataFilteringReset = action.payload
    },
    setWaitingForProductsToLoad: (state, action: PayloadAction<boolean>) => {
      state.waitingForProductsToLoad = action.payload
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
    setGranulesToReGenerate,
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
    setAllUserProducts,
    setFirstHistoryPageData,
    setHistoryPageState,
    addPageToHistoryPageState,
    setCurrentFilter,
    setWaitingForMyDataFiltering,
    setWaitingForMyDataFilteringReset,
    setWaitingForProductsToLoad
} = productSlice.actions

export default productSlice.reducer