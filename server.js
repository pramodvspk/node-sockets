var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var moment = require('moment');

// Creating a server using a built in node module instead of express
// Start a new server and use the express app as boiler plate
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));

var clientInfo = {};
var systemMessage = {
	name: 'System',
	timestamp: moment().valueOf
};

function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];
	if (typeof info === 'undefined') {
		return; 
	} else {
		Object.keys(clientInfo).forEach(function (socketId) {
			var userInfo = clientInfo[socketId];
			if(userInfo.room == info.room) {
				users.push(userInfo.name);
			}
		});
	}
	systemMessage.text = 'Current users: ' + users.join(',');
	socket.emit('message', systemMessage);
}

// Initializing moment
io.on('connection', function (socket) {
	console.log("The user has been connected");
	
	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id]
		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			systemMessage.text = userData.name + ' has left the room';
			io.to(userData.room).emit('message', systemMessage);
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		systemMessage.text = req.name+ ' has joined!!';
		socket.broadcast.to(req.room).emit('message', systemMessage);
	});

// Allowing 2 browsers to communicate
	socket.on('message', function (message) {

		if(message.text == '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			console.log("Message received: " + message.text);
			// Emitting the message out to everybody except who sent the message
			//socket.broadcast.emit('message', message);
			message.timestamp = moment().valueOf();
			// Emits the message only to the users who are in the same room
			io.to(clientInfo[socket.id].room).emit('message', message);			
		}
	});

	systemMessage.text = "Welcome to the chat application";
	socket.emit('message', systemMessage);
});

http.listen(PORT, function () {
	console.log('Server started on port '+ PORT);
});
