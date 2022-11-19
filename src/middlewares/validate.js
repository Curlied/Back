const httpStatus = require('http-status');

const body_validator = (schema) => (request, response, next) => {
  const { body } = request;
  const { body: body_schema } = schema;
  const { error } = body_schema.validate(body);
  if (error) {
    const errorMessage = error.details.map(item => `${item.message.replace(`"${item.path?.[0]}"`, `${item.path?.[0]}`).trim()}`);
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
  body_validator
};