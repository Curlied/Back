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
  isConnected,
  theRequestorIsTokenUser
} = require('../middlewares/user.middleware');




/**
 * GET /users/profils
 * @summary Get current user profil informations and all events in progress 
 * @security BearerAuth
 * @tags users
 * @return {User-profil} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *   "username": "username profil",
 *   "age": 23,
 *   "description": "Pionnièr(e) passionné(e) du Web. Praticien amateur de la culture pop. Amoureux d'Internet. Accro au café. Spécialiste de la musique. Geek au bacon.",
 *   "eventInProgress": [
 *     {
 *       "_id": "KBB3GQUMAOOEMVPMRBLHG08K",
 *       "name": "basket ball",
 *       "date_time": "2023-05-30T19:17:25.968Z",
 *       "place": "4374 Rue Molière",
 *       "url_image": [
 *         "https://loremflickr.com/320/240/Abstract/any?lock=1440899771"
 *       ],
 *       "categoryInfo": {
 *         "name": "Sport",
 *         "url_image": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/background/bg-sport.jpg",
 *         "url_icon": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/svg/sport.svg"
 *       }
 *     },
 *     {
 *       "_id": "Z90O0893B5Z974I334T3LFKQ",
 *       "name": "Black Panther : Wakanda Forever",
 *       "date_time": "2023-06-17T20:05:20.426Z",
 *       "place": "838 Quai des Grands Augustins",
 *       "url_image": [
 *         "https://loremflickr.com/320/240/Abstract/any?lock=86952590"
 *       ],
 *       "categoryInfo": {
 *         "name": "Cinéma",
 *         "url_image": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/background/bg-cinema.jpg",
 *         "url_icon": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/svg/cinema.svg"
 *       }
 *     }
 *   ]
 * }
 */
router.get('/profils', [isConnected], userController.myProfilDetailsUsers);

/**
 * GET /users/infos
 * @summary Get only user informations
 * @security BearerAuth
 * @tags users
 * @return {User-infos} 200 - success response - application/json
 * @example response - 200 - success response example
 * 	{
 *    "username": "username",
 *    "email": "email@fake.fr",
 *    "birthdate": "1970-02-21T00:00:00.000Z",
 *    "telephone": "0606060606"
 *  }
 */
router.get('/infos', [isConnected], userController.personalInformationsDetailsUser);

/**
 * GET /users/events
 * @summary Gives all current events created and in which the current user participates
 * @security BearerAuth
 * @tags users
 * @return {User-events} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *   "eventsCreate": [
 *     {
 *       "_id": "52CL1CPNESQCPHOJCU4RI5WFR",
 *       "date_time": "2024-05-11T06:38:26.518Z",
 *       "is_validate": true,
 *       "name": "basket ball",
 *       "place": "4374 Rue Molière",
 *       "url_image": [
 *         "https://loremflickr.com/320/240/Abstract/any?lock=1440899771"
 *       ],
 *       "user_max": 4,
 *       "users_valide": [],
 *       "users_waiting": [
 *         {
 *           "_id": "52CL1CPNESQCPHOJCU4RI5WFR",
 *           "username": "Mathilde"
 *         },
 *         {
 *           "_id": "4RSDZA7IGXZSN5WN6XYT2HAJ3",
 *           "username": "testeeur"
 *         }
 *       ],
 *       "users_refused": [],
 *       "users_cancel": [],
 *       "categoryInfo": {
 *         "name": "Sport",
 *         "url_image": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/background/bg-sport.jpg",
 *         "url_icon": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/svg/sport.svg"
 *       }
 *     },
 *     {
 *       "_id": "52CL1CPNESQCPHOJCU4RI5WFR",
 *       "date_time": "2023-03-20T02:37:03.122Z",
 *       "is_validate": true,
 *       "name": "Black Panther : Wakanda Forever",
 *       "place": "838 Quai des Grands Augustins",
 *       "url_image": [
 *         "https://loremflickr.com/320/240/Abstract/any?lock=86952590"
 *       ],
 *       "user_max": 3,
 *       "users_valide": [
 *         {
 *           "_id": "52CL1CPNESQCPHOJCU4RI5WFR",
 *           "username": "mana"
 *         },
 *         {
 *           "_id": "52CL1CPNESQCPHOJCU4RI5WFR",
 *           "username": "Sigebert"
 *         }
 *       ],
 *       "users_waiting": [],
 *       "users_refused": [],
 *       "users_cancel": [],
 *       "categoryInfo": {
 *         "name": "Cinéma",
 *         "url_image": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/background/bg-cinema.jpg",
 *         "url_icon": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/svg/cinema.svg"
 *       }
 *     }
 *   ],
 *   "eventsParticipate": [
 *     {
 *       "_id": "52CL1CPNESQCPHOJCU4RI5WFR",
 *       "date_time": "2024-05-11T06:38:26.518Z",
 *       "name": "basket ball",
 *       "place": "4374 Rue Molière",
 *       "url_image": [
 *         "https://loremflickr.com/320/240/Abstract/any?lock=1440899771"
 *       ],
 *       "user_max": 4,
 *       "categoryInfo": {
 *         "name": "Sport",
 *         "url_image": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/background/bg-sport.jpg",
 *         "url_icon": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/svg/sport.svg"
 *       },
 *       "statusCurrentUser": "en attente"
 *     },
 *     {
 *       "_id": "52CL1CPNESQCPHOJCU4RI5WFR",
 *       "date_time": "2023-10-13T00:11:53.781Z",
 *       "name": "enigmatic",
 *       "place": "3 Quai des Grands Augustins",
 *       "url_image": [
 *         "https://loremflickr.com/320/240/Abstract/any?lock=1961749589"
 *       ],
 *       "user_max": 9,
 *       "categoryInfo": {
 *         "name": "Escape game",
 *         "url_image": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/background/bg-escapegame.jpg",
 *         "url_icon": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/svg/escapegame.svg"
 *       },
 *       "statusCurrentUser": "validé"
 *     }
 *   ]
 * }
 */
router.get('/events', [isConnected], userController.getAllEventsFromSpaceUser);

/**
 * GET /users/roles
 * @summary Get current user role
 * @security BearerAuth
 * @tags users
 * @return {string[]} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *   "message": "Voici mes roles",
 *   "body": [
 *     "user"
 *   ]
 * }
 */
router.get('/roles', [isConnected], userController.getRoles);

/**
 * POST /users/register
 * @summary sign in an user
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
 * @summary  login user by email and password
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

/**
 * PUT /users
 * @summary Update user information
 * @param {User-infos} request.body.required - users info - application/json
 * @security BearerAuth
 * @tags users
 * @return {boolean} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "L'utilisateur a été actualisé avec succès",
 *    "body": true
 *  }
 */
router.put('/',[isConnected, theRequestorIsTokenUser], userController.updateInfo);

/**
 * PUT /users/confirm
 * @summary Update the account confirmation statut - ⚠ need the key generate in email
 * @security BearerAuth
 * @tags users
 * @return {boolean} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "Votre compte a été créée et validé avec succès",
 *    "body": true
 *  }
 */
router.put('/confirm', authController.confirm);


module.exports = router;