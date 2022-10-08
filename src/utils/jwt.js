const jwt = require('jsonwebtoken');
const config = require('../config/index');

const generate_token = (username) => {
  return jwt.sign({ name: username }, config.token.secret, { expiresIn: config.token.expire * 60 });
};

module.exports = generate_token;