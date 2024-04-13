import { padCPSForCmrQuery } from "../components/sidebar/GranulesTable"
import { spatialSearchCollectionConceptId, userProductQueryLimit } from "./rasterParameterConstants"

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
    {
        currentUser {
            products (limit: ${userProductQueryLimit}) {
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

export const getGranules = `
    query($tileParams: GranulesInput) {
        tiles: granules(params: $tileParams) {
            items {
                granuleUr
            }
        }
    }
`

export const getGranuleVariables = (cycle: number, pass: number, sceneIds: number[]) => {
    const sceneIdsForGranuleName = sceneIds.map(sceneId => `SWOT_L2_HR_Raster_*_${padCPSForCmrQuery(String(sceneId))}F_*`)
    const variables = {
        "tileParams": {
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