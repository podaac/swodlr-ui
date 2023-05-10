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

export interface granuleAlertMessageConstantType {
  [key: string]: string
}

export interface generatedProduct {
  granuleId: string,
  status: StatusTypes,
  downloadUrl?: string,
}

export type StatusTypes = 'IN_PROGRESS' | 'COMPLETE'

export type TabTypes = 'productCustomization' | 'productHistory'