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
  footprint: LatLngExpression[],
  inTimeRange?: boolean
}

export interface GranuleForTable {
  granuleId: string,
  cycle: string,
  pass: string,
  scene: string,
}

export interface GenerateProductParameters {
  outputGranuleExtentFlag: number,
  outputSamplingGridType: string,
  rasterResolutionUTM: number,
  rasterResolutionGEO: number
}

export interface sampleGranuleData {
  name: string,
  cycle: string,
  pass: string,
  scene: string
}

export interface granuleAlertMessageConstantType {
  [key: string]: AlertMessageObjectConstant
}

export interface ParametersUsedToGenerate {
  batchGenerateProductParameters: GenerateProductParameters
  utmZoneAdjust?: string,
  mgrsBandAdjust?: string
}

export interface GeneratedProduct {
  productId: string,
  granuleId: string,
  status: StatusTypes,
  cycle: string,
  pass: string,
  scene: string,
  parametersUsedToGenerate: ParametersUsedToGenerate,
  downloadUrl?: string | null,
  dateGenerated?: Date
}

export interface ParameterOptions {
  [key: string]: string
}

export interface AdjustValueDecoder {
  [key: string]: string
}

export type StatusTypes = 'In Progress' | 'Complete'

export type TabTypes = 'granuleSelection' | 'productCustomization'

export type GridTypes = 'utm' | 'geo' 

export interface ParameterHelp {
  [key: string]: string
}

export type PageTypes = 'welcome' | 'productCustomization' | 'generatedProductsHistory' | 'about'

export interface AlertMessageObjectConstant {
  message: string,
  variant: "danger" | "success" | "warning",
}

export interface AlertMessageObject {
  type: string,
  message: string,
  variant: "danger" | "success" | "warning",
  timeoutId: ReturnType<typeof setTimeout>,
  tableType: TableTypes
}

export type CustomizeProductSidebarTypes = 'selectScenes' | 'configureOptions'
export interface CustomizeProductSidebarProps {
  mode: CustomizeProductSidebarTypes
}

export type TableTypes = 'granuleSelection' | 'productCustomization'
export interface GranuleTableProps {
  tableType: TableTypes
}

export interface GranuleSelectionAndConfigurationViewProps {
  mode: CustomizeProductSidebarTypes
}

export type AdjustType = "zone" | "band"

export interface UserData {
  id: string
}

export type InputType = 'cycle' | 'pass' | 'scene'

export interface inputValuesDictionary {
  [key: string]: {max: number, min: number}
}

export interface newUrlParamsObject {
  [key: string]: string | number | boolean
}

export interface validScene {
  [key: string]: boolean
}

export type alertMessageInput = 'success' | 'alreadyAdded' | 'allScenesNotAvailable' | 'alreadyAddedAndNotFound' | 'noScenesAdded' | 'readyForGeneration' | 'invalidCycle' | 'invalidPass' | 'invalidScene' | 'invalidScene' | 'someScenesNotAvailable' | 'granuleLimit' | 'notInTimeRange'

export interface SpatialSearchResult {
  cycle: string,
  pass: string,
  scene: string
}
export type footprintResponse = LatLngExpression[] | boolean