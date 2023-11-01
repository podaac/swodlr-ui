import { LatLngExpression } from "leaflet"
import { ParameterHelp, ParameterOptions, granuleAlertMessageConstantType, inputValuesDictionary, parameterValuesDictionary } from "../types/constantTypes"

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
    granuleId: 'Granule ID',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
}

export const productCustomizationLabelsUTM = {
    granuleId: 'Granule ID',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
    utmZoneAdjust: 'UTM Zone Adjust',
    mgrsBandAdjust: 'MGRS Band Adjust',
}

export const productCustomizationLabelsGEO = {
    granuleId: 'Granule ID',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
}

export const generatedProductsLabels = {
    productId: 'Product ID',
    granuleId: 'Granule ID',
    status: 'Status',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
    outputGranuleExtentFlag: 'Output Granule Extent Flag',
    outputSamplingGridType: 'Output Sampling Grid Type',
    rasterResolution: 'Raster Resolution',
    utmZoneAdjust: 'UTM Zone Adjust',
    mgrsBandAdjust: 'MGRS Band Adjust',
    downloadUrl: 'Download URL',
    dateGenerated: 'Date Generated'
}

export const infoIconsToRender = ['outputGranuleExtentFlag', 'outputSamplingGridType', 'rasterResolution', 'utmZoneAdjust', 'mgrsBandAdjust', 'cycle', 'pass', 'scene']

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

export const parameterHelp: ParameterHelp = {
    outputGranuleExtentFlag: `There are two sizing options for raster granules: square (128 km x 128 km) or rectangular (256 km x 128 km). The square granule extent utilizes the data from only the specific square scene ID indicated, whereas the rectangular granule extent utilizes the specific square scene ID indicated and data from the two adjacent scene IDs along the SWOT swath. At the very edges of scenes, there is a risk that the pixels SWOT measures will not be aggregated as accurately into the raster product. The rectangular extent addresses this issue and could be most helpful with points of interest near the edges of scenes.`,
    outputSamplingGridType: `Specifies the type of the raster sampling grid. It can be either a Universal Transverse Mercator (UTM) grid or a geodetic latitude-longitude grid.`,
    rasterResolution: `Resolution of the raster sampling grid in units of integer meters for UTM grids and integer arc-seconds for latitude-longitude grids.`,
    utmZoneAdjust: `The Universal Transverse Mercator (UTM) projection is divided into 60 local zones 6° wide in Longitude. By default, UTM raster processing uses the UTM zone at the scene center. If a common grid is desired for scenes near each other, the zone per scene can be adjusted (+/- 1 zone) to allow nearby L2_HR_Raster outputs to be sampled on a common grid. This parameter has no effect if the output grid is not UTM.`,
    mgrsBandAdjust: `The Military Grid Reference System (MGRS) defines alphabetic Latitude bands. By default, UTM raster processing uses the MGRS band at the scene center. If a common grid is desired for scenes near each other, the band per scene can be adjusted (+/- 1 band) to allow nearby L2_HR_Raster outputs to be sampled on a common grid. This parameter has no effect if the output grid is not UTM.`,
    cycle: `The repeat orbit cycle number of the observation. SWOT’s orbit is 21 days and thus observations in the same 21-day orbit period would have the same cycle number.`,
    pass: `Predefined sections of the orbit between the maximum and minimum latitudes. SWOT has 584 passes in one cycle, split into ascending and descending passes`,
    scene: `Predefined 128 x 128 km squares of the SWOT observations.`
}

export interface InputBounds {
    InputType: {
        min: number,
        max: number
    }
  }

  export const inputBounds: inputValuesDictionary = {
    cycle: {
        min: 1,
        max: 154
    },
    pass: {
        min: 1,
        max: 584
    },
    scene: {
        min: 0,
        max: 399
    }
  }

export const granuleAlertMessageConstant: granuleAlertMessageConstantType = {
    success: {
        message: 'Successfully added granules!',
        variant: 'success',
    },
    alreadyAdded: {
        message: 'Some granules have already been added.',
        variant: 'danger',
    },
    notFound:{
        message: 'Some granules were not found.',
        variant: "danger",
    },
    alreadyAddedAndNotFound: {
        message: 'Some granules have already been added or not found',
        variant: 'danger',
    },
    noGranulesAdded: {
        message: 'No granules have been added yet. You must have granules added before switching to Generate mode.',
        variant: 'danger',
    },
    readyForGeneration: {
        message: 'Remember: customize your product parameters before starting Generation',
        variant: 'warning',
    },
    invalidCycle: {
        message: `Cycle is either not in range [${inputBounds.cycle.min} - ${inputBounds.cycle.max}] or contains invalid characters`,
        variant: 'danger',
    },
    invalidPass: {
        message: `Pass is either not in range [${inputBounds.pass.min} - ${inputBounds.pass.max}] or contains invalid characters`,
        variant: 'danger',
    },
    invalidScene: {
        message: `Scene is either not in range [${inputBounds.scene.min} - ${inputBounds.scene.max}] or contains invalid characters`,
        variant: 'danger',
    }
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