/**
* Primary file for the api
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// Instantiating the http server
const httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

// Start the http server 
httpServer.listen(config.httpPort, function() {
    console.log(`The server is listening on port ${config.httpPort}`);
});

// Instantiate the https server
const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    unifiedServer(req, res);
});

// Start the https server
httpsServer.listen(config.httpsPort, function (){
    console.log(`The server is listening on port ${config.httpsPort}`);
});

// All the server logic for both the http and https server
const unifiedServer = function (req, res) {
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
    // 'end' event runs on every request
    req.on('end', function(){
        buffer += decoder.end();
        
        // Choose the handler this request should go to
        // If one is not found, use the notFound handler
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        
        // Construct the data object to send to the handler
        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the response
            console.log('Returning this response: ', statusCode, payloadString );
        })

        // Send the response
        // res.end('Hello World\n');

        // Log the request path
        // console.log('Request received with payload:', buffer);
        //console.log('Request received with these headers', headers);
        //console.log('Request is received on path: '+trimmedPath+' with method: '+method+ ' with these query string parameters: '+ JSON.stringify(queryStringObject));
    });
};

// Define the handlers
const handlers = {};

// Sample handler
handlers.sample = function(data, callback) {
    // callback a http status code and a payload object
    callback(406, {'name': 'sample handler'});
};
// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};
// Define a request router
const router = {
    'sample': handlers.sample
};

