const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { check_body_exist, check_params_exist } = require('../middlewares/common');

// import common middlewares
const { user_is_connected, theRequestorIsTokenUser, check_email_changes, check_user_exist } = require('../middlewares/user.middleware');
const { body_validator, params_validator } = require('../middlewares/validate');

// import validation email
const { body_email, userId } = require('../validations/email.validation');


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
router.get('/profils',
  user_is_connected,
  userController.myProfilDetailsUsers
);

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
router.get('/infos',
  user_is_connected,
  userController.personalInformationsDetailsUser
);

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
 *       "_id": "1R4A3BAWK0OTWX1XXMWMHVI1",
 *       "name": "bocuse",
 *       "date_time": "2023-01-01T20:07:11.382Z",
 *       "user_max": 6,
 *       "place": "43 Quai Bonaparte",
 *       "is_validate": true,
 *       "url_image": [
 *         "https://loremflickr.com/320/240/Abstract/any?lock=1669526051"
 *       ],
 *       "categoryInfo": {
 *         "name": "Restaurant",
 *         "url_image": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/background/bg-restaurant.jpg",
 *         "url_icon": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/svg/restaurant.svg"
 *       },
 *       "usersComplet": [
 *         {
 *           "username": "Mathilde",
 *           "status": "En attente de validation"
 *         },
 *         {
 *           "username": "test10",
 *           "status": "En attente de validation"
 *         }
 *       ]
 *     }
 *   ],
 *   "eventsParticipate": [
 *     {
 *       "_id": "1R4A3BAWK0OTWX1XXMWMHVI1",
 *       "name": "basket ball",
 *       "date_time": "2023-05-30T19:17:25.968Z",
 *       "user_max": 4,
 *       "place": "4374 Rue Molière",
 *       "url_image": [
 *         "https://loremflickr.com/320/240/Abstract/any?lock=1440899771"
 *       ],
 *       "categoryInfo": {
 *         "name": "Sport",
 *         "url_image": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/background/bg-sport.jpg",
 *         "url_icon": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/svg/sport.svg"
 *       },
 *       "statusCurrentUser": "En attente de validation"
 *     }
 *   ]
 * }
 */
router.get('/events',
  user_is_connected,
  userController.getAllEventsFromSpaceUser
);

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
router.get('/roles',
  user_is_connected,
  userController.getRoles
);

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
router.put('/',
  user_is_connected,
  theRequestorIsTokenUser,
  userController.updateInfo
);

/**
 * PUT /users/{user_id}/email
 * @summary Update user's email address
 * @param {User-infos} request.body.required - users info - application/json
 * @security BearerAuth
 * @tags users
 * @return {boolean} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "L'email de l'utilisateur a été actualisé avec succès",
 *    "body": true
 *  }
 */
router.put('/:userId/email',
  user_is_connected,
  check_params_exist, params_validator(userId),
  check_body_exist,
  check_user_exist,
  check_email_changes, body_validator(body_email),
  userController.updateUserEmail
);

module.exports = router;