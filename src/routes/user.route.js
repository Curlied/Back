const express = require('express');
const validate = require('../middlewares/validate');
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const authValidation = require('../validations/auth.validation');
const router = express.Router();
const {
  push_image
} = require('../middlewares/digitalocean.middleware');
const {
  isUniqueMail,
  isValidate,
  isConnected
} = require('../middlewares/user.middleware');




// should be put because we update users confirmation
router.get('/confirm', authController.confirm);

// nok no session management in resful api
router.get('/disconnect', [isConnected], authController.disconnect);

// nok should be users/profils
router.get('/space-user/my-profil', [isConnected], userController.myProfilDetailsUsers);

// What's the differences between these 2 path ? -> understand and change

// nok should be users/infos 
router.get('/space-user/personal-infos', [isConnected], userController.personalInformationsDetailsUser);

// nok should be users/events 
router.get('/space-user/all-events', [isConnected], userController.getAllEventsFromSpaceUser);

// ok
router.get('/roles', [isConnected], userController.getRoles);


/**
 * POST /users/register
 * @summary This is the summary of the endpoint
 * @param {User} request.body.required - users info - application/json
 * @tags users
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
router.post('/register', [validate(authValidation.register), isUniqueMail, push_image('users_pictures'),], authController.register);

/**
 * POST /users/login
 * @summary This is the summary of the endpoint
 * @param {Login} request.body.required - email & password - application/json
 * @tags users
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
router.post('/login', [validate(authValidation.login), isValidate], authController.login);


module.exports = router;