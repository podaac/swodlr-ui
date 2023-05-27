import { AuthenticationResponse } from "../../types/authenticationTypes";

export const checkUserAuthentication = async () => {
    const url = "https://d15gds5czd9p7k.cloudfront.net"
    const options: RequestInit = {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
          },
        redirect: "manual"
    }
    try {
        const response = await fetch(url, options);
        const jsonData = await response.json();
        const responseStatus = jsonData.status
        console.log(responseStatus)
        const redirectUrl = jsonData.headers.Location
        
        console.log(jsonData)
        
        if (responseStatus === '200') {
            const returnObj: AuthenticationResponse =  {status: 'authenticated'}
            console.log('200', returnObj)
            return returnObj
        } else if (responseStatus === '302') {
            const returnObj: AuthenticationResponse =  {status: 'unauthenticated', redirectUrl}
            console.log('302', returnObj)
            return returnObj
        } else {
            const returnObj: AuthenticationResponse =  {status: 'unknown'}
            console.log('unknown', returnObj)
            return returnObj
        }
    } catch (err) {
        console.log (err)
        if (err instanceof Error) {
            const returnObj: AuthenticationResponse =  {status: 'error', errorMessage: err.message as string}
            return returnObj
          }
    }
}