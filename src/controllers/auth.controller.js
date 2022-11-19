const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const constants = require('../utils/Constantes');
const fs = require('fs');
const { Cache, ReplaceUserNameAndUrl } = require('../services/email.service');
const httpStatus = require('http-status');
const errorF = require('../utils/error');
const successF = require('../utils/success');
const configs = require('../config/index');

const register = async (request, response) => {
  try {
    const userCreated = await userService.create(request.body);
    const urlTemp = emailService.GetTempURl(userCreated.email);
    let emailHtml = fs
      .readFileSync(constants.EMAIL_TEMPLATE.PATH_CONFIRMATION_INSCRIPTION)
      .toString();

    emailHtml = await ReplaceUserNameAndUrl(
      emailHtml,
      userCreated.username,
      urlTemp
    );
    emailService.sendHtmlEmail(
      userCreated.email,
      'Confirmation inscription',
      emailHtml
    );
    successF(constants.MESSAGE.REGISTER_SUCCES, userCreated, 200, response);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, response);
  }
};

const login = async (request, response) => {
  let email = request.body.email;
  let password = request.body.password;
  const data = await userService.login(email, password);
  if (!data) {
    var errorPass = new Error('Invalida Credentials');
    return errorF(errorPass.message, errorPass, httpStatus.BAD_REQUEST, response);
  }
  const token = data.token;
  response.cookie('access_token', token, {
    httpOnly: true,
    secure: configs.environment === 'prod',
  });
  successF('The connection has been done', data.username, httpStatus.OK, response);
};

const confirm = async (request, response) => {
  try {
    const MagicKey = request.query.key;
    const email = Cache.get(MagicKey);
    if (email) {
      const user = await userService.findOneAndUpdate(email);

      if (user.is_validate == true) {
        successF(constants.MESSAGE.CONFIRMATION_MAIL_SUCCESS, true, 200, response);
        Cache.del(MagicKey);
      } else {
        const error = new Error(constants.MESSAGE.CONFIRMATION_MAIL_ERROR);
        errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, response);
      }
    } else {
      const error = new Error(constants.MESSAGE.CONFIRMATION_MAIL_NOT_POSSIBLE);
      errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, response);
    }
  }
  catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, response);
  }
};

const disconnect = async (request, response) => {
  try {
    response.clearCookie('access_token');
    successF(constants.MESSAGE.DISCONNECT_OK, true, 200, response);
  }
  catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, response);
  }
};

module.exports = {
  register,
  login,
  confirm,
  disconnect
};