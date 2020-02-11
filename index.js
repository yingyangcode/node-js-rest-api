/**
* Primary file for the api
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer(function(req, res){

    // Get the url and parse it
    // True means parse the query string and send it to the query string module
    // url module has the ability to call the queryString module with this boolean flag
     const parsedUrl = url.parse(req.url, true);
    
    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object
    const urlParams = new URLSearchParams(parsedUrl.search);
    const queryStringObject = Object.fromEntries(urlParams);
   
    // Get the HTTP method
    const method = req.method.toLowerCase();

    // Get the headers
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data){
        buffer += decoder.write(data);
    });
    req.on('end', function(){
        buffer += decoder.end();
    
        // Send the response
        res.end('Hello World\n');

        // Log the request path
        console.log('Request received with payload:', buffer);
        //console.log('Request received with these headers', headers);
        //console.log('Request is received on path: '+trimmedPath+' with method: '+method+ ' with these query string parameters: '+ JSON.stringify(queryStringObject));
    });
});

// Start the server and have it listen on port 3000
server.listen(3000, function() {
    console.log("The server is listening on port 3000 now");
});



