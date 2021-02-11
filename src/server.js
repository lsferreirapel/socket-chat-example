const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const auth = require('./services/auth');

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

// Express configs
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// If token is valid send user to chat else send user to login page 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', (req, res) => { 

  // Get info from body
  const { username, color } = req.body;

  // Create a new token
  const token = auth.createNewToken(username, color);
  
  // Save token on cookies
  res.cookie('token', token);

  // Send user to chat page
  res.status(200).redirect('/chat');
});


app.get('/chat', (req, res) => {
  // Get token from cookies
  const token = req.cookies.token;
  
  // Validate token, if is valid send user to chat page
  //  else send user to login page
  if(auth.tokenIsValid(token)) {
    res.sendFile(__dirname + '/views/chat.html');
  } else {
    res.redirect('/');
  }

})

sockets.on('connection', (socket) => {
  // Get token from socket handshake, "set on client-side"
  let token = socket.handshake.auth.token;

  // Get user info form token
  let user = auth.getUserFromToken(token);


  // Send alert to server side when user connect and disconnect
  socket.broadcast.emit('user connection', `${user.username} connected`);
  socket.on('disconnect', () => {
    sockets.emit('user connection', `${user.username} disconnected`);
  });

  // Send the user message to server side
  socket.on('chat message', msg => {
    sockets.emit('chat message', msg);
  });
});

// Start server
server.listen(3000, () => console.log('🔥 Server linstening on port:3000'));