import { request, gql, GraphQLClient } from 'graphql-request'
import { userQuery } from '../constants/graphqlQueries';
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
        // let config = await ((await fetch(`${baseUri}/config`)).json());
        // const headers = {
        //         method: "POST",
        //         redirect: "manual",
        //         mode: "cors",
        //         credentials: "include"
        //       }

        //      const options = {  
        //         credentials: 'include',
        //         mode: 'cors',
        //     }
        
        // const userInfoResponse = await request(graphqlUri, userIdQuery, undefined, options)
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

// export const getUserInfo = async () => {
//   try {
//     const graphqlResponse = await request(`${baseUri}/graphql`, userIdQuery)
//     return graphqlResponse
//   } catch (err) {
//     console.log(err)
//   }
// }
