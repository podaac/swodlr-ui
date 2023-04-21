export interface parameterValuesObject {
    values: string[] | number[],
    default: string | number
}

export interface parameterValuesDictionary {
    [key: string]: parameterValuesObject
 }

 export interface allProductParameters {
    name: string,
    cycle: string,
    pass: string,
    scene: string,
    outputGranuleExtentFlag: number,
    outputSamplingGridType: string,
    rasterResolution: number,
    utmZoneAdjust: string,
    mgrsBandAdjust: string
 }