export function urs_login(username: string, password: string)
{
    var client_id = "xxyyzz";
    var urs_url = "https://urs.earthdata.nasa.gov/oauth/authorize?response_type=code&client_id=" + client_id;
    var auth = "credentials=" + window.btoa(username + ":" + password);
    var redirect_url = "http://www.myserver.com/app/login.php&state=some_information";
 
    // Initiate the login
     
    var request = null;
 
    try {    
        request = new XMLHttpRequest();
        request.open("POST", urs_url + "&redirect_uri=" + redirect_url, true);
        request.withCredentials = true;
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // request.setRequestHeader("Content-length", String(auth.length));
        
         
        request.onreadystatechange = function() {
            if( this.readyState == 4 ) {
                if( this.status == 200 ) {
                    var profile = JSON.parse(this.responseText);
                    alert("Welcome " + profile.first_name + " " + profile.last_name);
                }
                else {
                    alert("ERROR: " + this.status );
                }
            }
        }
        request.send(auth);
    }
    catch(err) {
        // alert("ERROR: " + err.message);
        alert("ERROR: ");
    }
 
    return false;
}

export const checkUserAuthentication = async () => {
    const url = "http://example.com/movies.json"
    const options: RequestInit = {
        method: "POST",
        mode: "no-cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
          },
    }
    const response = await fetch(url, options);
    const jsonData = await response.json();
    console.log(jsonData);
    // window.location.replace('https://d15gds5czd9p7k.cloudfront.net');
}