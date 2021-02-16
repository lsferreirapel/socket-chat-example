const jwt = require('jsonwebtoken');
const Color = require('color');

// Key used to encript the token
const jwtSecret = "@QEGTUI"

// Online token list
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

  // If token is online (tokenList) return true, else return false
  tokenIsOnline(token) {
    if (tokenList.filter(item => item === token).length >= 1) {
      return true;
    } else {
      return false
    }
  },

  // Insert token on tokenList
  insertOnlineToken(token) { 
    tokenList.push(token);
  },

  // Delete token
  deleteToken(token) {
    tokenList = tokenList.filter(item => item !== token);
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

  // If token is valid, get username and color from token
  getUserFromToken(token) {
    try {
      // Validate token
      let jwtPayload = jwt.verify(token, jwtSecret);

      // Color constructor
      let color = Color(jwtPayload.color);

      // If the contrast with the black color is lower than 1.6
      //  mix color with white color
      if (color.contrast(Color('black')) < 1.6) {
        color = color.mix(Color('white'), 0.2);
      }

      // Create user
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

