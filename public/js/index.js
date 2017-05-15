var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});


socket.on('newMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const li = $('<li></li>').text(`${message.from} ${formattedTime}: ${message.text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const li = $('<li></li>').text(`${message.from} ${formattedTime}: `);
  const a = $('<a target="_blank">My current location</a>').attr('href', message.url);

  li.append(a);
  $('#messages').append(li);
})

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

const $locationButton = $('#send-location');
const $messageTextBox = $('[name=message]');

$('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: $messageTextBox.val()
  }, function() {
    $messageTextBox.val('');
  });
});

$locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  $locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position) {
    $locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function() {
    alert('Unable to fetch location.');
    $locationButton.removeAttr('disabled').text('Send location');
  })
});
