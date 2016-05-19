var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
// Creating a server using a built in node module
// Start a new server and use the express app as the boiler plate
var http = require('http').Server(app);
var io = require('socket.io')(http);

// use express static to expose a folder
app.use(express.static(__dirname + '/public'));

// On the connection event
io.on('connection', function () {
	console.log("User connected via socket.io!");
});

http.listen(PORT, function () {
	console.log("Server started");
});

