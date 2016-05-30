var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var moment = require('moment');

// Creating a server using a built in node module instead of express
// Start a new server and use the express app as boiler plate
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Initializing moment
io.on('connection', function (socket) {
	console.log("The user has been connected");

// Allowing 2 browsers to communicate
	socket.on('message', function (message) {
		console.log("Message received: " + message.text);
		// Emitting the message out to everybody except who sent the message
		//socket.broadcast.emit('message', message);
		message.timestamp = moment().valueOf();
		io.emit('message', message);
	});

	socket.emit('message', {
		text: "Welcome to the chat application",
		timestamp: moment().valueOf()
	});
});

app.use(express.static(__dirname + '/public'));

http.listen(PORT, function () {
	console.log('Server started on port '+ PORT);
});
