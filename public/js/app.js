var socket = io();
socket.on('connect', function () {
	console.log("Connected to the socket.io server");
});

// Custom event name, callback function data gets passed
socket.on('message', function (message) {
	console.log('New message: ');
	console.log(message.text);

	// Adding the message to the div - messages
	jQuery(".messages").append("<p>"+message.text+"</p>");
});

// Handles submitting of new message
var $form = jQuery("#message-form");

$form.on("submit", function (event) {
	// Doesnt let the page to refresh
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		text: $message.val()
	});
	$message.val('');
});
