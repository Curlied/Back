const responses = require('../models/responses');
const config = require('../config/index');

const error = (message, error, code, response) => {
  response.status(code);
  if (config.environment == 'prod') {
    response.json(
      new responses(message, {})
    );
  } else {
    response.json(
      new responses(message, `${error}`)
    );
  }
  return response;
};

module.exports = error;