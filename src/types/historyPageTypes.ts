import { ProductState } from "./graphqlTypes";
export type OutputGranuleExtentFlagOptions = '128 x 128' | '256 x 128'
export type OutputSamplingGridType = 'UTM' | 'LAT/LON'
export type Adjust = '1' | '0' | '-1' | 'N/A'
export type RasterResolution = '90' | '100' | '120' | '125' | '200' | '250' | '500' | '1000' | '2500' | '5000' | '10000' | '3' | '4' | '5' | '6' | '8' | '15' | '30' | '60' | '180' | '300'

export interface FilterParameters {
  cycle: string,
  scene: string,
  pass: string,
  status: ProductState[],
  outputGranuleExtentFlag: OutputGranuleExtentFlagOptions[],
  outputSamplingGridType: OutputSamplingGridType[],
  rasterResolution: RasterResolution[],
  utmZoneAdjust: Adjust[],
  mgrsBandAdjust: Adjust[],
  startDate: Date | 'none',
  endDate: Date | 'none'
}

export type FilterAction = 'cycle' | 'scene' | 'pass' | 'status' | 'outputGranuleExtentFlag' | 'outputSamplingGridType' | 'rasterResolution' | 'utmZoneAdjust' | 'mgrsBandAdjust' | 'startDate' | 'endDate' | 'reset'