var socket = io();

function scrollToBottom() {
  // Selectors
  let $messages = $('#messages');
  const $newMessage = $messages.children('li:last-child');
  // Heights
  const clientHeight = $messages.prop('clientHeight');
  const scrollTop = $messages.prop('scrollTop');
  const scrollHeight = $messages.prop('scrollHeight');
  const newMessageHeight = $newMessage.innerHeight();
  const lastMessageHeight = $newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    $messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('newMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#message-template').html();
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#location-message-template').html();
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
})

socket.on('updateUserList', function(users) {
  const $ol = $('<ol></ol>');

  users.forEach(function(user) {
    $ol.append($('<li></li>').text(user));
  });

  $('#users').html($ol);
});

socket.on('disconnect', function() {
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
