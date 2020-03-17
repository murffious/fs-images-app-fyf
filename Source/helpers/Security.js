const jwt = require("jsonwebtoken");

// For CLI we need to load detenv.
if(!process.env.ENVIRONMENT){
  require('dotenv').config();
}

const SECRET = process.env.SECRET;
const TOKEN_EXPIRE_LENGTH = '24h';

/**
 * Security Class used for basic security operations
 */
module.exports = class Security {
  /**
     * Get a new user token
     *
     * @param {String} email        The username/email of the user
     * @param {Number} id           The id of the user //not using yet **
     * @returns                     A token generated for api access
     */
    getNewUserToken(email,id) {
    const token = jwt.sign({
      email
    }, SECRET, { expiresIn: TOKEN_EXPIRE_LENGTH });
    return token;
  }
 
}