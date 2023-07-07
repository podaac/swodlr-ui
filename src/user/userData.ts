import { request, gql, GraphQLClient } from 'graphql-request'
import { userQuery } from '../constants/graphqlQueries';

const userIdQuery = gql`${userQuery}`
const baseUri = 'https://d15gds5czd9p7k.cloudfront.net';
const graphqlUri = baseUri + '/graphql'

const graphQLClient = new GraphQLClient(graphqlUri, {
    credentials: `include`,
    mode: `cors`,
  })

export const getUserData = async () => {
    try {
        // let config = await ((await fetch(`${baseUri}/config`)).json());
        const headers = {
                method: "POST",
                redirect: "manual",
                mode: "cors",
                credentials: "include"
              }

             const options = {  
                credentials: 'include',
                mode: 'cors',
            }
        
        // const userInfoResponse = await request(graphqlUri, userIdQuery, undefined, options)
        const userInfoResponse = await graphQLClient.request(userIdQuery)
    } catch (err) {
        console.log (err)
        if (err instanceof Error) {
            return err
          } else {
            return 'something happened'
          }
    }
}