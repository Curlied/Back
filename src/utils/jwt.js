const jwt = require('jsonwebtoken');
const config = require('../config/index');

const generate_token = (username) => {
  return jwt.sign({ name: username }, config.token.secret, { expiresIn: config.token.expire * 60 });
};

const getHeaderToken = (request)=>{
  const {headers } = request;
  return headers.authorization?.split('Bearer ')[1];
}

module.exports = {
  generate_token,
  getHeaderToken
}