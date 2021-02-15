const jwt = require('jsonwebtoken');
const Color = require('color');

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

