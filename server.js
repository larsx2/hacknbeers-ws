var http = require('http');
var sockjs = require('sockjs');
var NodeStatic = require('node-static');

var options = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.7.min.js"};
var ws = sockjs.createServer(options);
var users = {};

function onData(sender, msg) {
  console.log("Got " +msg+ " from " +sender);
  Object.keys(users).forEach(function(nick) {
    if (sender === nick) return;

    console.log(">> Sending data to " +msg+ " to "+ nick);
    users[nick].write(sender +": "+ msg);
  })
};

function broadcast(msg) {
  Object.keys(users).forEach(function(nick) {
    users[nick].write(msg);
  });
}

var counter = 1;
function onConnect(conn) {
  var nick = 'Guest' + counter++;
  conn.write("Welcome to the Chat Room " +nick);

  users[nick] = conn;

  conn.on('data', function(msg) {
    onData(nick, msg);
  });
  conn.on('close', function() {
    delete users[nick];
    broadcast(nick + " is out of the chat!");
    
  });
}

ws.on('connection', onConnect);

var staticDir = new NodeStatic.Server(__dirname);

var server = http.createServer();
server.addListener('request', function(req, res) {
  staticDir.serve(req, res);
});
server.addListener('upgrade', function(req,res){
  res.end();
});

ws.installHandlers(server, {prefix:'/chat'});

console.log(' [*] Listening on 0.0.0.0:9999' );
server.listen(9999, '0.0.0.0');
