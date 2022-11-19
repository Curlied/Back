const httpStatus = require('http-status');
const { BODY_IS_REQUIRED, QUERY_IS_REQUIRED } = require('../utils/Constantes').MESSAGE;

const check_body_exist = (request, response, next) => {
  const { body } = request;
  if (!body | !Object.keys(body).length) return response.status(httpStatus.BAD_REQUEST).json({
    message: BODY_IS_REQUIRED
  });
  next();
};

const check_query_exist = (request, response, next) => {
  const { query } = request;
  if (!query | !Object.keys(query).length) return response.status(httpStatus.BAD_REQUEST).json({
    message: QUERY_IS_REQUIRED
  });
  next();
};

const check_params_exist = (request, response, next) => {
  const { params } = request;
  if (!params | !Object.keys(params).length) return response.status(httpStatus.BAD_REQUEST).json({
    message: QUERY_IS_REQUIRED
  });
  next();
};

module.exports = {
  check_body_exist,
  check_query_exist,
  check_params_exist
};