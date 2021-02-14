const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const auth = require('./services/auth');
const routes = require('./routes/routes');

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);


// Express configs
app.use(express.static('public'))
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// Routes
app.use(routes);

let userList = [];


sockets.on('connection', (socket) => {
  // Get token from socket handshake, "set on client-side"
  let token = socket.handshake.auth.token;
  // Get user info form token
  let user = auth.getUserFromToken(token);
  // Save user on list
  userList.push(user);

  // Emit user to client side
  socket.emit('user information', user);

  // Emit online userlist to client-side
  socket.emit('online users', userList);
  console.log('ONLINE USERS:')
  console.log(userList)

  // Send alert to client side when user connect and disconnect
  socket.broadcast.emit('user connection', `${user.username} connected`, 'green');
  socket.on('disconnect', () => {
    sockets.emit('user connection', `${user.username} disconnected`, 'red');
    
    userList = userList.filter(arrUser => arrUser !== user)
    socket.emit('online users', userList);
    console.log('ONLINE USERS:')
    console.log(userList)
  });

  // Recive a typing event, and send that to client side whith user data
  socket.on('typing', (bool) => {
    socket.broadcast.emit('typing', bool, user);
  })

  // Send the user message to client side
  socket.on('chat message', msg => {
    sockets.emit('chat message', msg, user);
  });
});

// Start server
server.listen(3000, () => console.log('🔥 Server linstening on port:3000'));