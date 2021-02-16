const socketio = require('socket.io');
const auth = require('./auth');

module.exports = (server) => {
  const sockets = socketio(server);

  // Save users online to render on client side
  let userList = [];

  // Event start on user connection
  sockets.on('connection', (socket) => {

    // Get token from socket handshake, "set on client-side"
    let token = socket.handshake.auth.token;

    // Get user info form token
    let user = auth.getUserFromToken(token);

    // Save user on list
    userList.push(user);
    auth.insertOnlineToken(token);
  
    // Emit user information to client side
    socket.emit('user information', user);
  
    // Emit online userlist to client-side
    socket.emit('online users', userList);
    socket.broadcast.emit('online users', userList);
  
    // Send alert to client side when user connect
    socket.broadcast.emit('user connection', `${user.username} connected`, 'connect-message');

    // Event start on user disconnection
    socket.on('disconnect', () => {

      // Send alert to client side when user disconnect
      sockets.emit('user connection', `${user.username} disconnected`, 'disconnect-message');
      
      // Delete user on list
      userList = userList.filter(arrUser => arrUser !== user);
      auth.deleteToken(token);
  
      // Emit online userlist to client-side
      socket.broadcast.emit('online users', userList);
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
}