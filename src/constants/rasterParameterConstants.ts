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

export const granuleSelectionLabels = {
    granuleId: 'Granule ID',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
}

export const productCustomizationLabelsUTM = {
    granuleId: 'Granule ID',
    zoneAdjust: 'Zone Adjust',
    bandAdjust: 'Band Adjust',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
}

export const productCustomizationLabelsGEO = {
    granuleId: 'Granule ID',
    cycle: 'Cycle',
    pass: 'Pass',
    scene: 'Scene',
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

export const parameterHelpGpt: ParameterHelp = {
    outputGranuleExtentFlag: `This flag determines whether the SAS (System for Atmospheric Soundings) should generate data in non-overlapping or overlapping chunks.

    If you set the flag to '0', the SAS will produce data in non-overlapping chunks that cover an area of 128 km x 128 km.
    If you set the flag to '1', the SAS will generate data in overlapping chunks that cover a larger area of 256 km x 128 km.`,
    outputSamplingGridType: `Type of Raster Sampling Grid:

    "utm" refers to a Universal Transverse Mercator (UTM) grid.
    "geo" refers to a geodetic latitude-longitude grid.`,
    rasterResolution: `Resolution of Raster Sampling Grid:

    The resolution is given in units of integer meters for UTM grids.
    For latitude-longitude grids, the resolution is provided in units of integer arc-seconds.`,
    utmZoneAdjust: `UTM Grid Zone Parameter:

    This parameter enables the UTM grid to utilize a zone that is within +/-1 zone of the nearest zone to the center of the raster scene.
    The purpose is to allow nearby L2_HR_Raster outputs to be sampled on a common grid.
    Note that this parameter has no effect if the output grid is not in the UTM format.`,
    mgrsBandAdjust: `UTM Grid Latitude Band Parameter:

    This parameter enables the UTM grid to utilize an MGRS (Military Grid Reference System) latitude band that is within +/-1 band of the nearest band to the center of the raster scene.
    The purpose is to allow nearby L2_HR_Raster outputs to be sampled on a common grid.
    It's important to note that this parameter has no effect if the output grid is not in the UTM format.`
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
    }
  }

  export const parameterOptionHelp = {
    outputGranuleExtentFlag: 'test',
    outputSamplingGridType: 'test',
    rasterResolution: 'test',
    utmZoneAdjust: 'test',
    mgrsBandAdjust: 'test',
  }