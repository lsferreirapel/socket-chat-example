const routes = require('express').Router();
const auth = require('../services/auth');

// Default route, always send user to login page
routes.get('/', (req, res) => {
  let token = req.cookies.token;

  if (token && auth.tokenIsValid(token) && !auth.tokenIsOnline(token)) {
    // Send user to chat page
    res.status(200).redirect('/chat');
  } else {
    if  (auth.tokenIsOnline(token)) {
      res.send('User is already logged in!')
    } else {
      res.render('login.html');
    }
  }
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
  
  // Validate token, if is valid and isn't online send user to chat page
  //  else send user to login page
  if(auth.tokenIsValid(token) && !auth.tokenIsOnline(token)) {
    res.render('chat.html');
  } else {
    res.redirect('/');
  }
});

module.exports = routes;