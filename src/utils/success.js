const responses = require('../models/responses');

const success = (message, body, code, response) => {
  response.status(code);
  response.json(
    new responses(message, body)
  );
  return response;
};

module.exports = success;