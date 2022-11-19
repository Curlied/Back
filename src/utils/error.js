const Responses = require('../models/responses');

const error = (error, code, response) => {
  response.status(code);
  response.json(
    new Responses('Error', error.message)
  );
  return response;
};

module.exports = error;