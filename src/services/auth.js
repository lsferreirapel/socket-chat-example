const config = require('../config/config.js');
const jwt = require('jsonwebtoken');

  


const token = jwt.sign(
  { username, color},
  config.jwtSecret,
  { expiresIn: '1h' }
);