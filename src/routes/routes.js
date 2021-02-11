const routes = require('express').Router();
const auth = require('../services/auth');

// Default route, always send user to login page
routes.get('/', (req, res) => {
  res.sendFile('/views/login.html', { root: './src' });
});

// Login page (Login.html) send a request to this route
routes.post('/login', (req, res) => { 

  // Get info from body
  const { username, color } = req.body;

  // Create a new token
  const token = auth.createNewToken(username, color);
  
  // Save token on cookies
  res.cookie('token', token);

  // Send user to chat page
  res.status(200).redirect('/chat');
});

// Chat route
routes.get('/chat', (req, res) => {
  // Get token from cookies
  const token = req.cookies.token;
  
  // Validate token, if is valid send user to chat page
  //  else send user to login page
  if(auth.tokenIsValid(token)) {
    res.sendFile('/views/chat.html', { root: './src' });
  } else {
    res.redirect('/');
  }
});

module.exports = routes;