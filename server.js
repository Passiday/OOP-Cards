var express = require('express');
var socket = require('socket.io');
var fs = require('fs');
var port = process.env.PORT || 1234;

// App setuo
var app = express();
var server = app.listen(port, function() {
  console.log('Express server listening on port', port);
});
var io = socket(server);
io.on('connection', function(socket) {
  console.log('Connection established, id=', socket.id);
  console.log('Connection data', socket.handshake.query);
  timeout[socket.id]=true;
  var initData = socket.handshake.query.initData ? JSON.parse(socket.handshake.query.initData) : null;
  state.clientJoin(socket.id, initData);

  socket.emit('init', {

  });

  socket.on("username",function(data) {

  });
  // Inform all other connected sockets about the new connection

  // Establish the message event listeners


  socket.on('disconnect', function(reason) {

  });
});

class RoomState {
  constructor() {
    this.clients = {};
  }
  publicDataFull() {
    // Data that describe the current state and can be shared publicly
    return this.clients;
  }
  publicDataClient(clientId) {
    // Data that describe a particular client and can be shared publicly
    return {
      id  : clientId,
      data: this.clients[clientId]
    }
  }
  clientJoin(id, data) {
    this.clients[id] = data;
  }
  clientUpdate(id, data) {
    if (id in this.clients) {
      let client = this.clients[id];
      client.x = data.x;
      client.y = data.y;
    }
  }
  clientLeave(id, reason) {
    delete this.clients[id];
  }
}

var state = new RoomState();
