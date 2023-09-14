import { resolve } from "path";
import { userQuery } from "../constants/graphqlQueries";
import { TestAuthenticationResponse } from "../types/authenticationTypes";
import { getUserDataResponse } from "./userData";
import { CurrentUser, UserResponse } from "../types/graphqlTypes";
import { useAppSelector, useAppDispatch } from '../redux/hooks'

const baseUri = process.env.REACT_APP_SWODLR_API_BASE_URI
const redirectUri = process.env.REACT_APP_DEV_REDIRECT_URI

export const checkUserAuthentication = async () => {
    try {
        let config = await ((await fetch(`${baseUri}/config`)).json());
        let res = ((await fetch(`${baseUri}/graphql`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          redirect: "manual",
          credentials: "include",
          mode: "cors",
          body: JSON.stringify({
            query: userQuery,
            variables: {}
          })
        }).then(async (response) => {
          if (response.type === 'opaqueredirect') {
            // RETURN redirect uri to be used for login
            const testAuthenticationObj: TestAuthenticationResponse = { authenticated: false, redirectUri: baseUri + config.authenticationUri + redirectUri };
            return testAuthenticationObj;
          } else if (response.status === 200) {
            // RETURN authenticated response
            const userData = await (response.json())
            const userResult: CurrentUser = (userData.data as UserResponse).currentUser;
            const testAuthenticationObj: TestAuthenticationResponse = { authenticated: true, data: userResult };
            return testAuthenticationObj;
          } else {
            return { authenticated: false, error: 'unknown error occured' } as TestAuthenticationResponse;
          }
        })))
        return res
    } catch (err) {
        console.log (err)
        if (err instanceof Error) {
            return {authenticated: false, error: err.message as string} as TestAuthenticationResponse
          } else {
            return {authenticated: false, error: 'unknown error occured'} as TestAuthenticationResponse
          }
    }
}