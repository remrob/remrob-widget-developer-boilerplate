// app.js
const chokidar = require('chokidar');
const WebSocket = require('ws');
const http = require('http');

const express         = require('express');
const app             = express();

app.use(express.static(__dirname + '/static'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.send(JSON.stringify({ initMsg: 'test' }));
});

server.listen(process.env.PORT || 5000, function listening() { // , port: 8050
  console.log('Listening on %d', server.address().port);
});


wss.broadcast = function broadcast(data) {
  console.log('refresh', data);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};


const watcher = chokidar.watch('./static');
watcher
  .on('ready', () => console.log('Scan complete. Ready for changes.'))
  .on('add', path => {
    console.log('add', path)
    wss.broadcast(JSON.stringify({ action: 'reload' }))
  })
  .on('unlink', path => {
    console.log('del', path)
    wss.broadcast(JSON.stringify({ action: 'reload' }))
  })
  .on('change', path => {
    console.log('change', path)
    wss.broadcast(JSON.stringify({ action: 'reload' }))
  });