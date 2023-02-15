const Responses = require('../models/responses');

const error = (error, code, response) => {
  response.status(code);
  response.json(
    new Responses(error.message, error)
  );
  return response;
};

module.exports = error;