import { padCPSForCmrQuery } from "../components/sidebar/GranulesTable"
import { spatialSearchCollectionConceptId } from "./rasterParameterConstants"

export const userQuery = `
    {
        currentUser {
            id
            email
            firstName
            lastName
        }
    }
`

export const generateL2RasterProductQuery = `
    mutation GenerateNewL2RasterProduct ($cycle: Int!, $pass: Int!, $scene: Int!, $outputGranuleExtentFlag: Boolean!, $outputSamplingGridType: GridType!, $rasterResolution: Int!, $utmZoneAdjust: Int, $mgrsBandAdjust: Int) { 
        generateL2RasterProduct(cycle: $cycle, pass: $pass, scene: $scene, outputGranuleExtentFlag: $outputGranuleExtentFlag, outputSamplingGridType: $outputSamplingGridType, rasterResolution: $rasterResolution, utmZoneAdjust: $utmZoneAdjust, mgrsBandAdjust: $mgrsBandAdjust) {
            cycle
            pass
            scene
            outputGranuleExtentFlag
            outputSamplingGridType
            rasterResolution
            utmZoneAdjust
            mgrsBandAdjust
        }
    }
`

export const userProductsQuery = `
    query getUserProducts($limit: Int, $after: ID, $cycle: Int, $pass: Int, $scene: Int, $outputGranuleExtentFlag: Boolean, $outputSamplingGridType: GridType, $beforeTimestamp: String, $afterTimestamp: String) 
    {
        currentUser {
            products (limit: $limit, after: $after, cycle: $cycle, pass: $pass, scene: $scene, outputGranuleExtentFlag: $outputGranuleExtentFlag, outputSamplingGridType: $outputSamplingGridType, beforeTimestamp: $beforeTimestamp, afterTimestamp: $afterTimestamp) {
                id
                timestamp
                cycle
                pass
                scene
                outputGranuleExtentFlag
                outputSamplingGridType
                rasterResolution
                utmZoneAdjust
                mgrsBandAdjust

                granules {
                    id
                    timestamp
                    uri
                }
                
                status (limit: 1) {
                    id
                    timestamp
                    state
                    reason
                }
            }
        }
    }
`

export const defaultUserProductsLimit = 1000000

export const getGranules = `
query($params: GranulesInput) {
    granules(params: $params) {
        items {
          producerGranuleId
          granuleUr
          timeStart
          timeEnd
          polygons
        }
        cursor
    }
}
`

// export const getSpatialSearchGranules = `
// query GetSpatialSearchGranules($params: GranulesInput) {
//   granules(params: $params) {
//     items {
//       producerGranuleId
//       granuleUr
//       timeStart
//       timeEnd
//       polygons
//     }
//   }
// }
// `

export const getGranuleVariables = (cycle: number, pass: number, sceneIds: number[]) => {
    const sceneIdsForGranuleName = sceneIds.map(sceneId => `SWOT_L2_HR_Raster_*_${padCPSForCmrQuery(String(sceneId))}F_*`)
    const variables = {
        "params": {
          'collectionConceptIds': [spatialSearchCollectionConceptId],
          "limit": 100,
          "cycle": cycle,
          "passes": {"0": {"pass": pass}},
          "readableGranuleName": sceneIdsForGranuleName,
          "options": {
            "readableGranuleName": {
              "pattern": true
            }
          }
        }
      }
    return variables
}

export const getSpatialSearchGranuleVariables = (polygon: string, collectionConceptId: string, limit: number, cursor?: string) => {
    const variables = {
        "params": {
          polygon,
          collectionConceptId,
          limit,
          cursor
        }
      }
    return variables
}

export const getFootprintVariables = (cycle: number, pass: number, sceneIds: number[]) => {
    const sceneIdsForGranuleName = sceneIds.map(sceneId => `SWOT_L2_HR_Raster_*_${padCPSForCmrQuery(String(sceneId))}F_*`)
    const variables = {
        "params": {
          'collectionConceptIds': [spatialSearchCollectionConceptId],
          "limit": 100,
          "cycle": cycle,
          "passes": {"0": {"pass": pass}},
          "readableGranuleName": sceneIdsForGranuleName,
          "options": {
            "readableGranuleName": {
              "pattern": true
            }
          },
        }
      }
    return variables
}