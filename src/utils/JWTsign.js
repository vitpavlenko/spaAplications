'use strict';

const JWT = require('jsonwebtoken');

let { JWT_SECRET_KEY } = process.env;

JWT_SECRET_KEY = JWT_SECRET_KEY || 'VerySecretKey';

module.exports = function JWTsign(email, resign_user_id) {

  return JWT.sign({ email, resign_user_id }, JWT_SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '14d'
  });
};
