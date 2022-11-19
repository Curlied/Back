const httpStatus = require('http-status');
const { BODY_IS_REQUIRED } = require('../utils/Constantes').MESSAGE;

const check_body_exist = (request, response, next) => {
  const { body } = request;
  if (!body | !Object.keys(body).length) return response.status(httpStatus.BAD_REQUEST).json({
    message: BODY_IS_REQUIRED
  });
  next();
};

module.exports = {
  check_body_exist
};