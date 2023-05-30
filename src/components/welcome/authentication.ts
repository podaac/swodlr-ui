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
        redirect: 'manual'
    }
    try {
        const response = await fetch(url, options);
        const jsonData = await response.json();
        const responseStatus = jsonData.status
        const redirectUrl = jsonData.headers.Location
        
        console.log(jsonData)
        
        if (responseStatus === '200') {
            const returnObj: AuthenticationResponse =  {status: 'authenticated'}
            return returnObj
        } else if (responseStatus === '302') {
            const returnObj: AuthenticationResponse =  {status: 'unauthenticated', redirectUrl}
            return returnObj
        } else {
            const returnObj: AuthenticationResponse =  {status: 'unknown'}
            return returnObj
        }
    } catch (err) {
        console.log (err)
    }
}