function handler(event: { request: any; }) {
    var request = event.request;
  
    if (!request.uri.includes('.')) {
      request.uri = "/index.html";
      request.querystring = {}
    }
  
    return request;
  }