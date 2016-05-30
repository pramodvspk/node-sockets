var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();

// Creating a server using a built in node module instead of express
// Start a new server and use the express app as boiler plate
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

http.listen(PORT, function () {
	console.log('Server started on port '+ PORT);
});
