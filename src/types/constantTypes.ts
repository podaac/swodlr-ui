import { LatLngExpression } from "leaflet"

export interface parameterValuesObject {
   values: string[] | number[],
   default: string | number | GridTypes
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

 export interface GenerateProductParameters {
  outputGranuleExtentFlag: number,
  outputSamplingGridType: string,
  rasterResolution: number,
  utmZoneAdjust: string,
  mgrsBandAdjust: string,
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

export interface GeneratedProduct {
  productId: string,
  granuleId: string,
  status: StatusTypes,
  parametersUsedToGenerate: GenerateProductParameters,
  downloadUrl?: string | null,
}

export type StatusTypes = 'IN_PROGRESS' | 'COMPLETE'

export type TabTypes = 'granuleSelection' | 'productCustomization' | 'productHistory'

export type GridTypes = 'utm' | 'geo' 

export interface ParameterHelp {
  [key: string]: string
}