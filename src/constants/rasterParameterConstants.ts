import { ParameterHelp, granuleAlertMessageConstantType, parameterValuesDictionary } from "../types/constantTypes"

export const rasterResolutionOptions = {
    UTM: [100, 125, 200, 250, 500, 1000, 2500, 5000, 10000],
    GEO: [3, 4, 5, 6, 8, 15, 30, 60, 180, 300]
}

export const parameterOptionValues: parameterValuesDictionary = {
    outputGranuleExtentFlag: {
        values: [0,1],
        default: 0
    },
    outputSamplingGridType: {
        values: ['utm', 'geo'],
        default: 'utm'
    },
    rasterResolutionUTM: {
        values: rasterResolutionOptions.UTM,
        default: 100
    },
    rasterResolutionGEO: {
        values: rasterResolutionOptions.GEO,
        default: 60
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

export const parameterOptions = {
    granuleId: 'ID',
    name: 'Name',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
    outputGranuleExtentFlag: 'Output Granule Extent Flag',
    outputSamplingGridType: 'Output Sampling Grid Type',
    rasterResolution: 'Raster Resolution',
    utmZoneAdjust: 'UTM Zone Adjust',
    mgrsBandAdjust: 'MGRS Band Adjust',
}

export const granuleEssentialLabels = {
    // name: 'Name',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
    granuleId: 'ID'
}

export const parameterOptionDefaults = {
    name: '',
    cycle: '',
    pass: '',
    scene: '',
    outputGranuleExtentFlag: 0,
    outputSamplingGridType: 'utm',
    rasterResolution: 100,
    utmZoneAdjust: '0',
    mgrsBandAdjust: '0',
}

export const parameterHelp: ParameterHelp = {
    outputGranuleExtentFlag: `	
    Flag indicating whether the SAS should produce a non-overlapping or overlapping granule
    
    “0” for a non-overlapping, 128 km x 128 km granule extent
    “1” for an overlapping, 256 km x 128 km granule extent`,
    outputSamplingGridType: `	
    Type of the raster sampling grid
    
    “utm” for a Universal Transverse Mercator (UTM) grid
    “geo” for a geodetic latitude-longitude grid`,
    rasterResolution: `	
    Resolution of the raster sampling grid in units of integer meters for UTM grids and integer arc-seconds for latitude-longitude grids`,
    utmZoneAdjust: `This parameter allows the UTM grid to use a zone within +/-1 zone of the closest zone to the center of the raster scene in order to allow nearby L2_HR_Raster outputs to be sampled on a common grid. This parameter has no effect if the output grid is not UTM.`,
    mgrsBandAdjust: `This parameter allows the UTM grid to use an MGRS latitude band within +/-1 band of the closest band to the center of the raster scene in order to allow nearby L2_HR_Raster outputs to be sampled on a common grid. This parameter has no effect if the output grid is not UTM.`,
}

export const granuleAlertMessageConstant: granuleAlertMessageConstantType = {
    success: 'Successfully added granules!',
    alreadyAdded: 'Some granules have already been added.',
    notFound: 'Some granules were not found.',
    alreadyAddedAndNotFound: 'Some granules have already been added or not found',
    noGranulesAdded: 'No granules have been added yet. You must have granules added before switching to Generate mode.',
    readyForGeneration: 'Remember: customize your product parameters before starting Generation'
  }

  export const parameterOptionHelp = {
    outputGranuleExtentFlag: 'test',
    outputSamplingGridType: 'test',
    rasterResolution: 'test',
    utmZoneAdjust: 'test',
    mgrsBandAdjust: 'test',
  }