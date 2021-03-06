var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

// Serve up static folder
var serve = serveStatic('src', {'index': 'index.html'})

// Create server
var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})

// Listen
server.listen(8080, function() {
  console.log('Appointment creator app is available at http://localhost:8080')
})