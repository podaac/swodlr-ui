import { request, gql, GraphQLClient } from 'graphql-request'
import { generateL2RasterProductQuery, userProductsQuery, userQuery } from '../constants/graphqlQueries';
import { CurrentUser, UserResponse } from '../types/graphqlTypes';

const userIdQuery = gql`${userQuery}`
const baseUri = process.env.REACT_APP_SWODLR_API_BASE_URI;
const graphqlUri = baseUri + '/graphql'

const graphQLClient = new GraphQLClient(graphqlUri, {
    credentials: `include`,
    mode: `cors`,
  })

export const getUserData = async () => {
    try {
        const userInfoResponse = await graphQLClient.request(userIdQuery).then((result: unknown | UserResponse) => {
          console.log(result)
          const userResult: CurrentUser = (result as UserResponse).currentUser
          return userResult
        })
        return userInfoResponse
    } catch (err) {
        console.log (err)
        if (err instanceof Error) {
            return err
          } else {
            return 'something happened'
          }
    }
}

export const generateL2RasterProduct = async (
  cycle: string,
  pass: string,
  scene: string,
  outputGranuleExtentFlag: number,
  outputSamplingGridType: string,
  rasterResolution: number,
  utmZoneAdjust: string,
  mgrsBandAdjust: string
  ) => {
  try {
      const variables = {
        cycle: parseInt(cycle),
        pass: parseInt(pass),
        scene: parseInt(scene),
        outputGranuleExtentFlag: Boolean(outputGranuleExtentFlag),
        outputSamplingGridType: outputSamplingGridType === 'lat/lon' ? 'GEO' : outputSamplingGridType.toUpperCase(),
        rasterResolution,
        utmZoneAdjust: parseInt(utmZoneAdjust),
        mgrsBandAdjust: parseInt(mgrsBandAdjust)
      }
      console.log(variables)
      const generateL2RasterProductResponse = await graphQLClient.request(generateL2RasterProductQuery, variables).then((result: unknown | UserResponse) => {
        console.log(result)
        // const userResult: CurrentUser = (result as UserResponse).currentUser
        // return userResult
      })
      console.log(generateL2RasterProductResponse)
      // return userInfoResponse
  } catch (err) {
      console.log (err)
      if (err instanceof Error) {
          return err
        } else {
          return 'something happened'
        }
  }
}

export const getUserProducts = async () => {
  try {
      const userProductResponse = await graphQLClient.request(userProductsQuery).then(result => {
        console.log(result)
        const userProductsResult = (result as UserResponse).currentUser.products
        return userProductsResult
      })
      return userProductResponse
  } catch (err) {
      console.log (err)
      if (err instanceof Error) {
          return err
        } else {
          return 'something happened'
        }
  }
}