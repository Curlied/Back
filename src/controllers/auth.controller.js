const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const constants = require('../utils/Constantes');
const fs = require('fs');
const { Cache, ReplaceUserNameAndUrl } = require('../services/email.service');
const httpStatus = require('http-status');
const errorF = require('../utils/error');
const successF = require('../utils/success');
const configs = require('../config/index');



const register = catchAsync(async (req, res, next) => {
  try {
    const userCreated = await userService.create(req.body);
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
    successF(constants.MESSAGE.REGISTER_SUCCES, userCreated, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const login = catchAsync(async (req, res, next) => {

  
  try {
    let email = req.body.email;
    let password = req.body.password;
    if(email  == null ||email == ''){
      var erroremailNull = new Error('L\'adresse mail ou le mot de passe est vide');
      return errorF(erroremailNull.message, erroremailNull, httpStatus.NOT_ACCEPTABLE, res, next);
    }
    if(password  == null || password == ''){
      var errorpwdNull = new Error('L\'adresse mail ou le mot de passe est vide');
      return errorF(errorpwdNull.message, errorpwdNull, httpStatus.NOT_ACCEPTABLE, res, next);
    }
    
    const data = await userService.login(req);

    if(data == 'email or password incorrect'){
      var errorPass = new Error('L\'adresse mail ou le mot de passe est invalide');
      return errorF(errorPass.message, errorPass, httpStatus.BAD_REQUEST, res, next);

    }
    const token = data.token; 
    if (token == 'Invalid Credentiel'  ) {
      var error = new Error('L\'adresse mail ou le mot de passe est invalide');
      errorF(error.message, error, httpStatus.BAD_REQUEST, res, next);
    } else {
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: configs.environment === 'prod',
      });
      successF('La connexion à bien été effectué', data.username, 200, res, next);
    }
  }
  catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const confirm = catchAsync(async (req, res, next) => {
  try {
    const MagicKey = req.query.key;
    const email = Cache.get(MagicKey);
    if (email) {
      const user = await userService.findOneAndUpdate(email);

      if (user.is_validate == true) {
        successF(constants.MESSAGE.CONFIRMATION_MAIL_SUCCESS, true, 200, res, next);
        Cache.del(MagicKey);
      } else {
        const error = new Error(constants.MESSAGE.CONFIRMATION_MAIL_ERROR);
        errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
      }
    } else {
      const error = new Error(constants.MESSAGE.CONFIRMATION_MAIL_NOT_POSSIBLE);
      errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
    }
  }
  catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const disconnect = catchAsync(async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    successF(constants.MESSAGE.DISCONNECT_OK, true, 200, res, next);
  }
  catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

module.exports = {
  register,
  login,
  confirm,
  disconnect
};