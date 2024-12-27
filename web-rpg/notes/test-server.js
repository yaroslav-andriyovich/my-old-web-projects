// var app = require('express')();
// // var cors = require('cors');
// var server  = require('http').createServer(app);
// var io      = require('socket.io')(server, {
//    cors: {
//     // origin: "http://site.com",
//     origin: "http://game",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["my-custom-header"],
//     credentials: true
//   }
// });
// var fs = require('fs');

// server.listen(777);

// io.sockets.on('connection', socket => {
//     console.log("new connection!");
//   });


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){

  //send the index.html file for all requests
  res.sendFile(__dirname + '/index2.html');

});

http.listen(777, function(){

  console.log('listening on *:777');

});

//for testing, we're just going to send data to the client every second
setInterval( function() {

  /*
    our message we want to send to the client: in this case it's just a random
    number that we generate on the server
  */
  var msg = Math.random();
  io.emit('message', msg);
  console.log (msg);

}, 1000);