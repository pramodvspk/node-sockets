var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

socket.on('connect', function () {
	console.log("Connected to the socket.io server");
	socket.emit('joinRoom', {	
		name: name,
		room: room
	});
});

// Custom event name, callback function data gets passed
socket.on('message', function (message) {
	console.log('New message: ');
	console.log(message.text);
	// Formatting the time
	var timestampMoment = moment.utc(message.timestamp);
	var localTimestamp = timestampMoment.local().format('h:mm a');

	// Adding the message to the ul - messages
	var $messages = jQuery(".messages");
	var $message = jQuery('<li class="list-group-item"></li>')

	$message.append("<p><strong>"+ message.name + ' ' + localTimestamp +"</strong></p>");
	$message.append("<p>"+ message.text +"</p>");
	$messages.append($message);	
});

// Handles submitting of new message
var $form = jQuery("#message-form");

$form.on("submit", function (event) {
	// Doesnt let the page to refresh
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		text: $message.val(),
		name: name
	});
	$message.val('');
});

$(document).ready(function() {
	console.log("In ready func");
	$(".room").text(room);
})