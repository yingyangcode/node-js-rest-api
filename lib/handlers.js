/**
 * Request Handlers
 */

 // Dependencies


// Define the handlers
const handlers = {};

// Ping handler
handlers.ping = function(data, callback) {
    // callback a http status code 
    callback(200);
};

// Hello handler 
handlers.hello = function(data, callback) {
    callback(200, {'message': 'Hello World'});
}

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Export the module
module.exports = handlers;