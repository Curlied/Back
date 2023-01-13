const httpStatus = require('http-status');

const body_validator = (schema) => (request, response, next) => {
  const { body } = request;
  const { body: body_schema } = schema;
  const { error } = body_schema.validate(body);
  if (error) {
    const errorMessage = error.details.map(item => `${item.message.replace(`"${item.path?.[0]}"`, `${item.path?.[0]}`).trim()}`).join(';');
    const statusCode = response.statusCode !== httpStatus.OK ? response.statusCode : httpStatus.BAD_REQUEST;
    response.status(statusCode);
    response.json({
      message: errorMessage,
    });
    return response;
  }
  next();
};

const query_validator = (schema) => (request, response, next) => {
  const { query } = request;
  const { query: query_schema } = schema;
  const { error } = query_schema.validate(query);
  if (error) {
    const errorMessage = error.details.map(item => `${item.message.replace(`"${item.path?.[0]}"`, `${item.path?.[0]}`).trim()}`).join(';');
    const statusCode = response.statusCode !== httpStatus.OK ? response.statusCode : httpStatus.BAD_REQUEST;
    response.status(statusCode);
    response.json({
      message: errorMessage,
    });
    return response;
  }
  next();
};

const params_validator = (schema) => (request, response, next) => {
  const { params } = request;
  const { params: params_schema } = schema;
  const { error } = params_schema.validate(params);
  if (error) {
    const errorMessage = error.details.map(item => `${item.message.replace(`"${item.path?.[0]}"`, `${item.path?.[0]}`).trim()}`).join(';');
    const statusCode = response.statusCode !== httpStatus.OK ? response.statusCode : httpStatus.BAD_REQUEST;
    response.status(statusCode);
    response.json({
      message: errorMessage,
    });
    return response;
  }
  next();
};

module.exports = {
  body_validator,
  query_validator,
  params_validator,
};