var nodemon = require('nodemon');

nodemon({ script: 'server.js' })
.on('start', function () {
  console.log('nodemon started');
})
.on('restart', function (arr) {
  console.log('nodemon restarted', arr);
}).on('crash', function () {
  console.log('script crashed for some reason');
});

// force a restart
// nodemon.emit('restart');

// force a quit
// nodemon.emit('quit');