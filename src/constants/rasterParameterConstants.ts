import { parameterValuesDictionary } from "../types/constantTypes"

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
        values: [100, 125, 200, 250, 500, 1000, 2500, 5000, 10000],
        default: 100
    },
    rasterResolutionGEO: {
        values: [3, 4, 5, 6, 8, 15, 30, 60, 180, 300],
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

export const parameterOptionLabels = {
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