import { gql, GraphQLClient, RequestMiddleware } from 'graphql-request'
import { generateL2RasterProductQuery, userProductsQuery, userQuery } from '../constants/graphqlQueries';
import { CurrentUser, UserResponse, getUserProductsResponse } from '../types/graphqlTypes';
import { Session } from '../authentication/session';

const userIdQuery = gql`${userQuery}`
const baseUri = process.env.REACT_APP_SWODLR_API_BASE_URI;
const graphqlUri = baseUri + '/graphql'

const requestMiddleware: RequestMiddleware = async (request) => {
  const session = await Session.getCurrent();
  if (session === null) {
    throw new Error('No current session');
  }

  const authToken = await session.getAccessToken();
  if (authToken === null) {
    throw new Error('Failed to get authentication token');
  }

  return {
    ...request,
    headers: {
      ...request.headers,
      Authorization: `Bearer ${authToken}`
    }
  }
}

const graphQLClient = new GraphQLClient(graphqlUri, {
    credentials: `include`,
    mode: `cors`,
    requestMiddleware
})

export const getUserDataResponse = async () => {
  try {
    const userDataResponse = await graphQLClient.request(userIdQuery)
    return userDataResponse
  } catch (err) {
    console.log (err)
    if (err instanceof Error) {
        return err
      } else {
        return 'something happened'
      }
  }
}

export const getUserData = async () => {
  const userInfoResponse = await graphQLClient.request(userIdQuery).then((result: unknown | UserResponse) => {
    const userResult: CurrentUser = (result as UserResponse).currentUser
    return userResult;
  })
  return userInfoResponse;
}

export interface ProductGenerationVariables {
  cycle: number,
  pass: number,
  scene: number,
  outputGranuleExtentFlag: boolean,
  outputSamplingGridType: string,
  rasterResolution: number,
  utmZoneAdjust?: number,
  mgrsBandAdjust?: number
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
    // TODO: why doesn't typescript like when I don't specifiy 2 different objects for variables utm and geo???
    // const variablesToUse: ProductGenerationVariables = {
    //   cycle: parseInt(cycle),
    //   pass: parseInt(pass),
    //   scene: parseInt(scene),
    //   outputGranuleExtentFlag: Boolean(outputGranuleExtentFlag),
    //   outputSamplingGridType: 'GEO',
    //   rasterResolution,
    // }

    // // if outputSamplingGridType is lat/lon (UTM)
    // if (outputSamplingGridType === 'lat/lon') {
    //   variablesToUse.utmZoneAdjust = parseInt(utmZoneAdjust)
    //   variablesToUse.mgrsBandAdjust = parseInt(mgrsBandAdjust)
    //   variablesToUse.outputSamplingGridType = outputSamplingGridType.toUpperCase()
    // }

    const utmVariables = {
      cycle: parseInt(cycle),
      pass: parseInt(pass),
      scene: parseInt(scene),
      outputGranuleExtentFlag: Boolean(outputGranuleExtentFlag),
      outputSamplingGridType: 'UTM',
      rasterResolution,
      utmZoneAdjust: parseInt(utmZoneAdjust),
      mgrsBandAdjust: parseInt(mgrsBandAdjust)
    }

    const geoVariables = {
      cycle: parseInt(cycle),
      pass: parseInt(pass),
      scene: parseInt(scene),
      outputGranuleExtentFlag: Boolean(outputGranuleExtentFlag),
      outputSamplingGridType: 'GEO',
      rasterResolution,
    }

    await graphQLClient.request(generateL2RasterProductQuery, outputSamplingGridType === 'lat/lon' ? geoVariables : utmVariables)
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
        const userProductsResult = (result as UserResponse).currentUser.products
        // const userProductsGeneratedForm = userProductResponse.result.map(productResult => {
        //   const {cycle, pass, scene, rasterResolution, outputGranuleExtentFlag, outputSamplingGridType, utmZoneAdjust, timestamp, id: productId, status} = productResult   
        //   // const generatedFormToReuturn: GeneratedProduct = 
        //   // return generatedFormToReuturn      
        // })

        // turn into GeneratedProduct
        // const generatedProduct: GeneratedProduct = {}
        return {status: 'success', products: userProductsResult} as getUserProductsResponse
      })
      return userProductResponse
  } catch (err) {
      console.log (err)
      if (err instanceof Error) {
          return {status: 'error', error: err} as getUserProductsResponse
        } else {
          return {status: 'unknown', error: 'something happened'} as getUserProductsResponse
        }
  }
}