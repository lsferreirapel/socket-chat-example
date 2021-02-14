const jwt = require('jsonwebtoken');
const jwtLightenDarkenColor = require('./color');

// Key used to encript the token
const jwtSecret = "@QEGTUI"

module.exports = {

  // Validate token, if is valid return true else return false
  tokenIsValid(token) {
    try {
      jwt.verify(token, jwtSecret);
      return true
    } catch (error) {
      return false
    }
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
      let jwtPayload = jwt.verify(token, jwtSecret);
      
      const user = {
        username: jwtPayload.username,
        color: jwtPayload.color,
        lightenColor: jwtLightenDarkenColor(jwtPayload.color, 150),
        darkerColor: jwtLightenDarkenColor(jwtPayload.color, -70),
      }
      return user

    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

