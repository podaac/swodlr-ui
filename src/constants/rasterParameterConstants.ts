import { LatLngExpression } from "leaflet"
import { ParameterHelp, ParameterOptions, granuleAlertMessageConstantType, inputValuesDictionary, parameterValuesDictionary } from "../types/constantTypes"
import { FilterParameters } from "../types/historyPageTypes"

export const rasterResolutionOptions = {
    UTM: [90, 100, 120, 125, 200, 250, 500, 1000, 2500, 5000, 10000],
    GEO: [3, 4, 5, 6, 8, 15, 30, 60, 180, 300]
}

export const parameterOptionValues: parameterValuesDictionary = {
    outputGranuleExtentFlag: {
        values: [0,1],
        default: 0
    },
    outputSamplingGridType: {
        values: ['utm', 'lat/lon'],
        default: 'utm'
    },
    rasterResolutionUTM: {
        values: rasterResolutionOptions.UTM,
        default: 100
    },
    rasterResolutionGEO: {
        values: rasterResolutionOptions.GEO,
        default: 3
    },
    utmZoneAdjust: {
        values: ['+1', '0', '-1'],
        default: '0'
    },
    mgrsBandAdjust: {
        values: ['+1', '0', '-1'],
        default: '0'
    },
}

export const parameterOptions: ParameterOptions = {
    granuleId: 'ID',
    name: 'Name',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
    outputGranuleExtentFlag: 'Output Granule Extent',
    outputSamplingGridType: 'Output Sampling Grid Type',
    rasterResolution: 'Raster Resolution',
    utmZoneAdjust: 'UTM Zone Adjust',
    mgrsBandAdjust: 'MGRS Band Adjust',
}

export const granuleSelectionLabels = {
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
}

export const productCustomizationLabelsUTM = {
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
    utmZoneAdjust: 'UTM Zone Adjust',
    mgrsBandAdjust: 'MGRS Band Adjust',
}

export const productCustomizationLabelsGEO = {
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
}

export const generatedProductsLabels = {
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
    status: 'Status',
    outputGranuleExtentFlag: 'Output Granule Extent Flag',
    outputSamplingGridType: 'Output Sampling Grid Type',
    rasterResolution: 'Raster Resolution',
    utmZoneAdjust: 'UTM Zone Adjust',
    mgrsBandAdjust: 'MGRS Band Adjust',
    downloadUrl: 'Download URL',
    dateGenerated: 'Date Generated'
}

export const infoIconsToRender = ['outputGranuleExtentFlag', 'outputSamplingGridType', 'rasterResolution', 'utmZoneAdjust', 'mgrsBandAdjust', 'cycle', 'pass', 'scene', 'status']

export const parameterOptionDefaults = {
    name: '',
    cycle: '',
    pass: '',
    scene: '',
    outputGranuleExtentFlag: 0,
    outputSamplingGridType: 'utm',
    rasterResolutionUTM: 100,
    rasterResolutionGEO: 3,
    utmZoneAdjust: '0',
    mgrsBandAdjust: '0',
}

export const granuleTableLimit = 10

export const parameterHelp: ParameterHelp = {
    outputGranuleExtentFlag: `There are two sizing options for raster granules: nonoverlapping square (128 km x 128 km) or overlapping rectangular (256 km x 128 km). The rectangular granule extent is 64 km longer in along-track on both sides of the granule and can be useful for observing areas of interest near the along-track edges of the nonoverlapping granules without the need to stitch sequential granules together.`,
    outputSamplingGridType: `Specifies the type of the raster sampling grid. It can be either a Universal Transverse Mercator (UTM) grid or a geodetic latitude-longitude grid.`,
    rasterResolution: `Resolution of the raster sampling grid in units of integer meters for UTM grids and integer arc-seconds for latitude-longitude grids.`,
    utmZoneAdjust: `The Universal Transverse Mercator (UTM) projection is divided into 60 local zones 6° wide in Longitude. By default, UTM raster processing uses the UTM zone at the scene center. If a common grid is desired for scenes near each other, the zone per scene can be adjusted (+/- 1 zone) to allow nearby L2_HR_Raster outputs to be sampled on a common grid. This parameter has no effect if the output grid is not UTM.`,
    mgrsBandAdjust: `The Military Grid Reference System (MGRS) defines alphabetic Latitude bands. By default, UTM raster processing uses the MGRS band at the scene center. If a common grid is desired for scenes near each other, the band per scene can be adjusted (+/- 1 band) to allow nearby L2_HR_Raster outputs to be sampled on a common grid. This parameter has no effect if the output grid is not UTM.`,
    cycle: `The repeat orbit cycle number of the observation. SWOT’s orbit is 21 days and thus observations in the same 21-day orbit period would have the same cycle number.`,
    pass: `Predefined sections of the orbit between the maximum and minimum latitudes. SWOT has 584 passes in one cycle, split into ascending and descending passes`,
    scene: `Predefined 128 x 128 km squares of the SWOT observations.`,
    status: `The processing status of your custom product. The status types are as follows: NEW, UNAVAILABLE, GENERATING, ERROR, READY, AVAILABLE`,
    granuleTableLimit: `There is a limit of ${granuleTableLimit} scenes allowed to be added to the scene table at a time. This is to ensure our scene processing pipeline can handle the demand of all of SWODLR's users.`
}

export interface InputBounds {
    InputType: {
        min: number,
        max: number
    }
}

export const inputBounds: inputValuesDictionary = {
    cycle: {
        min: 0,
        max: 578
    },
    pass: {
        min: 1,
        max: 584
    },
    scene: {
        min: 1,
        max: 154
    }
}

export const granuleAlertMessageConstant: granuleAlertMessageConstantType = {
    success: {
        message: 'Successfully added scenes!',
        variant: 'success',
    },
    alreadyAdded: {
        message: 'Some scenes have already been added.',
        variant: 'success',
    },
    allScenesNotAvailable:{
        message: 'The scenes entered are not available.',
        variant: "danger",
    },
    someScenesNotAvailable: {
        message: `Some scenes entered are not available.`,
        variant: 'danger',
    },
    alreadyAddedAndNotFound: {
        message: 'Some scenes have already been added or not found.',
        variant: 'danger',
    },
   noScenesFound: {
        message: 'No scenes were found.',
        variant: 'danger',
    },
    noScenesAdded: {
        message: 'No scenes have been added yet. You must have scenes added before switching to Generate mode.',
        variant: 'danger',
    },
    readyForGeneration: {
        message: 'Remember: customize your product parameters before starting Generation.',
        variant: 'warning',
    },
    invalidCycle: {
        message: `Cycle is either not in range [${inputBounds.cycle.min} - ${inputBounds.cycle.max}] or contains invalid characters.`,
        variant: 'danger',
    },
    invalidPass: {
        message: `Pass is either not in range [${inputBounds.pass.min} - ${inputBounds.pass.max}] or contains invalid characters.`,
        variant: 'danger',
    },
    invalidScene: {
        message: `Scene is either not in range [${inputBounds.scene.min} - ${inputBounds.scene.max}] or contains invalid characters.`,
        variant: 'danger',
    },
    granuleLimit: {
        message: `You can only process ${granuleTableLimit} scenes at a time so some scenes could not be added.`,
        variant: 'danger'
    },
    notInTimeRange: {
        message: `Some scenes were not within the specified spatial search time range.`,
        variant: 'danger'
    },
    someSuccess: {
        message: `Successfully added some scenes.`,
        variant: 'success'
    },
    successfullyGenerated: {
        message: `Successfully started product generation! Go to the 'My Data' page to track progress.`,
        variant: 'success'
    },
    spatialSearchAreaTooLarge: {
        message: `The search area you've selected on the map is too large. Please choose a smaller area to search.`,
        variant: 'warning'
    },
    successfullyReGenerated: {
        message: `Successfully re-submitted product generation! Go to the 'My Data' page to track progress.`,
        variant: 'success'
    },
  }

  export const parameterOptionHelp = {
    outputGranuleExtentFlag: 'test',
    outputSamplingGridType: 'test',
    rasterResolution: 'test',
    utmZoneAdjust: 'test',
    mgrsBandAdjust: 'test',
  }

  export const sampleFootprint: LatLngExpression[] = [
    [
      33.62959926136482,
      -119.59722240610449
    ],
    [
      33.93357164098772,
      -119.01030070905898
    ],
    [
      33.445222247065175,
      -118.6445806486702
    ],
    [
      33.137055033294544,
      -119.23445170097719
    ],
    [
      33.629599562267856,
      -119.59722227107866
    ]
  ] 

export const spatialSearchResultLimit = 2000
export const beforeCPS = '_x_x_x_'
export const afterCPSR = 'F_'
export const afterCPSL = 'F_'
export const spatialSearchCollectionConceptId = 'C2799438271-POCLOUD'
// export const footprintSearchCollectionConceptId = 'C2799438271-POCLOUD'

export const productsPerPage = '10'

export const defaultFilterParameters: FilterParameters = {
    cycle: 'none',
    pass: 'none',
    scene: 'none',
    outputGranuleExtentFlag: [],
    status: [],
    outputSamplingGridType: [],
    rasterResolution: [],
    utmZoneAdjust: [],
    mgrsBandAdjust: [],
    startDate: 'none',
    endDate: 'none'
}

export const defaultSpatialSearchStartDate = new Date(2022, 11, 16)
export const defaultSpatialSearchEndDate = new Date()