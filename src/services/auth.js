const jwt = require('jsonwebtoken');
const Color = require('color');

// Key used to encript the token
const jwtSecret = "@QEGTUI"

// user list
var tokenList = [];

module.exports = {

  // Validate token, if is valid return true else return false
  tokenIsValid(token) {    
    try {
      jwt.verify(token, jwtSecret);
      return true
    } catch (error) {
      tokenList = tokenList.filter(item => item !== token);
      return false
    }
  },

  // If user is online return true, else return false
  tokenIsOnline(token) {
    if (tokenList.filter(item => item === token).length >= 1) {
      return true;
    } else {
      return false
    }
  },

  insetOnlineToken(token) { 
    tokenList.push(token);
  },
  
  // Create a new token, valid for 3 hours
  createNewToken(username, color) {
    const token = jwt.sign(
      { username, color},
      jwtSecret,
      { expiresIn: '3h' }
    );

    return token;
  },

  // Delete token
  deleteToken(token) {
    tokenList = tokenList.filter(item => item !== token);
  },

  // If token is valid, get username and color from token
  getUserFromToken(token) {
    try {
      let jwtPayload = jwt.verify(token, jwtSecret);
      let color = Color(jwtPayload.color);

      if (color.contrast(Color('black')) < 1.6) {
        color = color.mix(Color('white'), 0.2);
      }

      const user = {
        username: jwtPayload.username,
        color: color.hex(),
        lightenColor: color.lighten(0.5).hex(),
        darkerColor: color.darken(0.5).hex(),
      }
      return user

    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

