import { LatLngExpression } from "leaflet"

export interface parameterValuesObject {
   values: string[] | number[],
   default: string | number
}

export interface parameterValuesDictionary {
   [key: string]: parameterValuesObject
 }

 export interface validFieldsObject {
   [key: string]: boolean
 }

 export interface allProductParameters {
   granuleId: string,
   name: string,
   cycle: string,
   pass: string,
   scene: string,
   outputGranuleExtentFlag: number,
   outputSamplingGridType: string,
   rasterResolution: number,
   utmZoneAdjust: string,
   mgrsBandAdjust: string,
   footprint: LatLngExpression[]
 }

 export interface sampleGranuleData {
   name: string,
   cycle: string,
   pass: string,
   scene: string
}