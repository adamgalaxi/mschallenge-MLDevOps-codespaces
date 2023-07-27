// Create web server
// 1. Create a web server
// 2. Create a request handler
// 3. Listen for requests
// 4. Extract the request path
// 5. Extract the query string object
// 6. Extract the HTTP method
// 7. Extract the headers
// 8. Extract the payload
// 9. Send the response
// 10. Send the payload

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Create the server
const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  // When the request emits the data event, append the payload to the buffer
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  // When the request emits the end event, end the buffer and send the response
  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found, use the notFound handler
    const chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      payload =