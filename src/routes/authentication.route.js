const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');

const {
  push_image
} = require('../middlewares/digitalocean.middleware');
const {
  isUniqueMail,
  isValidate,
  user_is_connected,
} = require('../middlewares/user.middleware');

// import common middlewares
const { check_body_exist, check_query_exist } = require('../middlewares/common');
const { body_validator, query_validator } = require('../middlewares/validate');


/**
 * POST /auth/register
 * @summary sign in an user
 * @param {User} request.body.required - auth info - application/json
 * @tags auth
 * @return {User} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *   "message": "Votre compte à correctement été enregistré, veuillez confirmer votre email",
 *   "body": {
 *     "username": "blabal",
 *     "password": "$xxxxxxxxx0x0x0x0x0x0x0x0x0x0x0x00x0x00xx0x",
 *     "birth_date": "2022-12-14T12:14:00.000Z",
 *     "telephone": "0102030405",
 *     "url_image": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Ffr%2Fphotos%2Fboum&psig=AOvVaw3ArECSy1QM0W8JCFMlH7ov&ust=1671103563768000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCKiU_YOA-fsCFQAAAAAdAAAAABAE",
 *     "roles": [
 *       "619f7447336ed5a57ab8974b"
 *     ],
 *     "is_validate": true,
 *     "email": "test99@test.fr",
 *     "description": "gendre idéal j'aime la rigoulade et les dégrindoulades!",
 *     "_id": "000x0x0x0x0x0x0x",
 *     "__v": 0
 *   }
 * }
 */
router.post('/register',
  check_body_exist, body_validator(authValidation.register),
  isUniqueMail,
  push_image('users_pictures'),
  authController.register
);

/**
 * POST /auth/login
 * @summary  login user by email and password
 * @param {Login} request.body.required - email & password - application/json
 * @tags auth
 * @return {User} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *     "message": "La connexion à bien été effectué",
 *     "body": "test10"
 * }
 * @return {string} 401 - unauthorized request response
 * @example response - 401 - success response example
 * {
 *   "message": "L'adresse mail ou le mot de passe est invalide",
 *   "body": "Error: L'adresse mail ou le mot de passe est invalide"
 * }
 */
router.post('/login',
  check_body_exist, body_validator(authValidation.login),
  isValidate,
  authController.login
);

/**
 * PUT /auth/confirm
 * @summary Update the account confirmation statut - ⚠ need the key generate in email
 * @security BearerAuth
 * @tags auth
 * @return {boolean} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "Votre compte a été créée et validé avec succès",
 *    "body": true
 *  }
 */
router.put('/confirm',
  check_query_exist, authController.email_confirmation
);

router.get('/disconnect',
  user_is_connected,
  authController.disconnect
);

module.exports = router;