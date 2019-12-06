var socket;
var socketAddress = window.location.host;
var players={};
function connectSocket() {
  if (socket) {
    console.error('Socket already connected');
    return;
  }

  // Init the socket
  socket = io(socketAddress);
  socket.on('connect', function() {
    console.log('Socket established, id =', socket.id);
  });
  // Listen for events
  socket.on('init', function(data) {

  });
}
function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
