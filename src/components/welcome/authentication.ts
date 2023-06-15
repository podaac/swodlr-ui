import { AuthenticationResponse } from "../../types/authenticationTypes";
import { request, gql } from 'graphql-request'

export const checkUserAuthentication = async () => {
    const baseUri = 'https://d15gds5czd9p7k.cloudfront.net';
    let config = await ((await fetch(`${baseUri}/config`)).json());
    const url = "https://d15gds5czd9p7k.cloudfront.net/graphql"
    // const options: RequestInit = {
    //     method: "POST",
    //     mode: "cors",
    //     credentials: "same-origin",
    //     headers: {
    //         "Content-Type": "application/json",
    //       },
    //     redirect: "manual"
    // }
    const options: RequestInit = {
        redirect: "manual",
        mode: "cors",
        credentials: "include"
    }
    const requestUri = `${baseUri}/graphql`
    // let res = await fetch(`${baseUri}/graphql`, {
    //     redirect: "manual",
    //     mode: "cors",
    //     credentials: "include"
    // });

//     if (res.type === 'opaqueredirect') {
//         let uri = baseUri + config.authenticationUri;
// ​
//         console.log("Redirecting: " + uri)
//         location.assign(uri);
//     }

const userIdQuery = gql`
  {
    currentUser {
      id
    }
  }
`
    try {
        let config = await ((await fetch(`${baseUri}/config`)).json());
        let res = await fetch(`${baseUri}/graphql`, {
            method: "POST",
            redirect: "manual",
            mode: "cors",
            credentials: "include"
          });
          if (res.type === 'opaqueredirect') {
            let uri = baseUri + config.authenticationUri
            console.log("Redirecting: " + uri)
            window.location.replace(uri);
          } else if (res.type === 'cors') {
            // try a graphql query
            const graphqlResponse = await request(`${baseUri}/graphql`, userIdQuery)
            console.log(graphqlResponse)
          }
        //   const graphqlResponse = await request(`${baseUri}/graphql`, userIdQuery)
        //   console.log(graphqlResponse)
        // const response = await fetch(requestUri, options);
        // const jsonData = await response.json();
        // const responseStatus = jsonData.status
        // console.log('resposne')
        // console.log(response)
        // const redirectUrl = jsonData.headers.Location
        
        console.log('res', res)
        
        // if (responseStatus === '200') {
        //     const returnObj: AuthenticationResponse =  {status: 'authenticated'}
        //     console.log('200', returnObj)
        //     return returnObj
        // } else if (responseStatus === '302') {
        //     const returnObj: AuthenticationResponse =  {status: 'unauthenticated', redirectUrl}
        //     console.log('302', returnObj)
        //     return returnObj
        // } else {
        //     const returnObj: AuthenticationResponse =  {status: 'unknown'}
        //     console.log('unknown', returnObj)
        //     return returnObj
        // }
    } catch (err) {
        console.log (err)
        if (err instanceof Error) {
            const returnObj: AuthenticationResponse =  {status: 'error', errorMessage: err.message as string}
            return returnObj
          }
    }
}