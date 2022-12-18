const express = require('express');
const validate = require('../middlewares/validate');
const eventController = require('../controllers/event.controller');
const eventValidation = require('../validations/event.validation');
const {
  push_image
} = require('../middlewares/digitalocean.middleware');
const filterF = require('../middlewares/filter.middleware');
const filterAllowed = ['name'];
const {
  isConnected,
  isAdmin
} = require('../middlewares/user.middleware');
const {
  eventExistAndNotDone,
  ifUserParticipeOnEvent,
  ifUserIsAdminEvent,
  userCanParticipateOnEvent,
  userCanCancelEvent,
  userCanCancelParticipationOnEvent
} = require('../middlewares/event.middleware');
const router = express.Router();

/**
 * GET /events
 * @summary Return all events not finish
 * @security BearerAuth
 * @tags events
 * @return {array<Event>} 200 - success response - application/json
 * @example response - 200 - success response example
 */
router.get('/', filterF(filterAllowed), eventController.getAll);

/**
 * GET /events/{id}
 * @summary Return detail event
 * @param {string} id.path.required - id mongo of event
 * @security BearerAuth
 * @tags events
 * @return {EventDetails} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *    "creator": {
 *      "username": "test10"
 *    },
 *    "name": "bocuse",
 *    "category": {
 *      "name": "Restaurant",
 *      "url_image": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/background/bg-restaurant.jpg",
 *      "url_icon": "https://curlied.sfo3.digitaloceanspaces.com/curliedImages/svg/restaurant.svg"
 *    },
 *    "date_time": "2023-01-01T20:07:11.382Z",
 *    "user_max": 6,
 *    "place": "43 Quai Bonaparte",
 *    "time": 18,
 *    "price": 93,
 *    "description": "Vous êtes riche ? non ? ba venez pas , je payerais pas votre part !",
 *    "is_validate": true,
 *    "created_at": "2021-07-11T09:55:35.037Z",
 *    "code": "73100-Aix-les-Bains",
 *    "department": "Savoie",
 *    "url_image": [
 *      "https://loremflickr.com/320/240/Abstract/any?lock=1669526051"
 *    ],
 *    "__v": 0,
 *    "users_waiting": [
 *      {
 *        "user_id": "01230561afbfbsd"
 *      }
 *    ],
 *    "users_valide": [
 *      {
 *        "user_id": "01230561afbfbsd"
 *      }
 *    ],
 *    "CurrentUserIsAdmin": false
 *  } 
 */
router.get('/:_id', [isConnected, eventExistAndNotDone, ifUserIsAdminEvent, ifUserParticipeOnEvent], eventController.getDetailsEvent); 

router.get('/filtered', filterF(filterAllowed), eventController.getAllFiltered);

router.post('/', [isConnected, validate(eventValidation.create), push_image('event_pictures'), ], eventController.create);

router.post('/search', validate(eventValidation.search), eventController.search);



/**
 * PUT /events/{id}
 * @summary Update an event => method only validate event
 * @param {string} id.path.required - id mongo of event
 * @security BearerAuth
 * @tags events
 * @return {EventDetails} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "Event validé",
 *    "body": true
 *  }
 */
router.put('/:_id', [isConnected /*, isAdmin /* commenté à gauche pas encore d'admin*/], eventController.validate);

router.put('/submit-participation', [isConnected, userCanParticipateOnEvent], eventController.submitParticipation);
router.put('/cancel-participation', [isConnected, userCanCancelParticipationOnEvent], eventController.cancelParticipation);

// should be delete without word cancel : events/id on delete action.
router.delete('/cancel/:_id', [isConnected, userCanCancelEvent], eventController.cancelEvent);

// router.get('/:_id', validate(null), eventController.getOne);
// router.put('/:_id', validate(eventValidation.update), eventController.update);






module.exports = router;