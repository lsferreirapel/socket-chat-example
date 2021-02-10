const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);


const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', (req, res) => { 
  const { username, color } = req.body;

  const token = jwt.sign(
    { username, color},
    "@QEGTUI",
    { expiresIn: '1h' }
  );
  console.log(token);
  
  res.cookie('token', token);
  res.status(200).redirect('/chat');
});

app.get('/chat', (req, res) => {
  const token = req.cookies.token;
  console.log('chat');
  console.log(token);
  if(token) {
    res.sendFile(__dirname + '/views/chat.html')
  } else {
    res.redirect('/');
  }
})

sockets.on('connection', (socket) => {
  
  // Send alert to server side when user connect and disconnect
  socket.broadcast.emit('user connection', 'a user connected');
  socket.on('disconnect', () => {
    sockets.emit('user connection', 'a user disconnected');
  });

  // socket.on('chat message', msg => {
  //   console.log(`message: ${msg}`)
  // });

  // Send the user message to server side
  socket.on('chat message', msg => {
    sockets.emit('chat message', msg);
  });
});

server.listen(3000, () => console.log('🔥 Server linstening on port:3000'));