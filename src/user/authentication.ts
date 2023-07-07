import { TestAuthenticationResponse } from "../types/authenticationTypes";
import configData from "../config.json"

export const checkUserAuthentication = async () => {
    const baseUri = configData.SWODLR_API_BASE_URI;
    const redirectUri = configData.DEV_REDIRECT_URI

// const userIdQuery = gql`
//   {
//     currentUser {
//       id
//     }
//   }
// `
    try {
        let config = await ((await fetch(`${baseUri}/config`)).json());
        let res = await fetch(`${baseUri}/graphql`, {
            method: "POST",
            redirect: "manual",
            mode: "cors",
            credentials: "include"
          });
          if (res.type === 'opaqueredirect') {
            // RETURN redirect uri to be used for login
            const testAuthenticationObj: TestAuthenticationResponse = {authenticated: false, redirectUri: baseUri + config.authenticationUri + redirectUri}
            return testAuthenticationObj
          } else if (res.type === 'cors') {
            // RETURN authenticated response
            const testAuthenticationObj: TestAuthenticationResponse = {authenticated: true}
            return testAuthenticationObj

            // const graphqlResponse = await request(`${baseUri}/graphql`, userIdQuery)
          } else {
            return {authenticated: false, error: 'unknown error occured'} as TestAuthenticationResponse
          }
    } catch (err) {
        console.log (err)
        if (err instanceof Error) {
            return {authenticated: false, error: err.message as string} as TestAuthenticationResponse
          } else {
            return {authenticated: false, error: 'unknown error occured'} as TestAuthenticationResponse
          }
    }
}