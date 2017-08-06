
// Get dependencies
const path = require('path');
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cors    = require('cors');

var config = require('../config/config'); // get our config file

var authRoutes   = require('./routes/authentication');
var msgRoutes = require('./routes/messages');
var msgUtils =  require('./utils/messages');
var app = express();
var server = require('http').Server(app);

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database

var users = [];

var whitelist = [
    'http://localhost:4200',
    'http://192.168.99.100:4000',
    'http://localhost:3000',
    'https://instant-chat-server.herokuapp.com',
    'https://instant-chat-ui.herokuapp.com'
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));
/*
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://instant-chat-ui.herokuapp.com' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
  */

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev')); 


// apply the routes to our application with the prefix /api
app.use('/api', authRoutes, msgRoutes);

app.get('/', function(req, res) {
  res.send('welcome to instant chat!!!');
}); 

server.listen(port);
console.log('Magic happens at http://localhost:' + port);

var io = require('socket.io').listen(server);

io.on('connection', function(socket){
  console.log('Socket connected');

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    console.log(data.msg);
    io.sockets.emit('new message', {
      message: data.msg,
      user: data.user
    });
    msgUtils({message: data.msg, user: data.user});

  });

  // when the client emits 'user joined', this listens and executes
  socket.on('user joined', function (data) {
    // we tell the client to execute 'new message'
    socket.user = data.user;
    io.sockets.emit('user joined', {
      user: data.user
    });
  });

    // when the user disconnects.. perform this
  socket.on('user left', function (data) {
    console.log(data.user + ' left the chat room');
      // echo globally that this client has left
      io.sockets.emit('user left', {
        user: data.user
      });
  });

});
