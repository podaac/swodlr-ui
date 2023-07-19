import { request, gql, GraphQLClient } from 'graphql-request'
import { CurrentUser, UserResponse } from '../types/graphqlTypes';

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
            products {
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
                
                status {
                    id
                    timestamp
                    state
                    reason
                }
            }
        }
    }
`