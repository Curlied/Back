const router = require('express').Router();
const eventController = require('../controllers/event.controller');
const eventValidation = require('../validations/event.validation');
const {
  push_image
} = require('../middlewares/digitalocean.middleware');
const filterF = require('../middlewares/filter.middleware');
const filterAllowed = ['name'];
const {
  user_is_connected,
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

// import common middlewares
const { check_params_exist, check_body_exist } = require('../middlewares/common');
const { body_validator, params_validator } = require('../middlewares/validate');

/**
 * GET /events
 * @summary Return all events not finish
 * @security BearerAuth
 * @tags events
 * @return {array<Event>} 200 - success response - application/json
 * @example response - 200 - success response example
 */
router.get('/',
  filterF(filterAllowed),
  eventController.getAll
);

/**
 * GET /events/{event_id}
 * @summary Return detail event
 * @param {string} event_id.path.required - id mongo of event
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
router.get('/:event_id',
  user_is_connected,
  check_params_exist, params_validator(eventValidation.retrieve),
  eventExistAndNotDone,
  ifUserIsAdminEvent,
  ifUserParticipeOnEvent,
  eventController.getDetailsEvent
);



/**
 * POST /events
 * @summary create an event
 * @param {Event} request.body.required - event - application/json
 * @security BearerAuth
 * @tags events
 * @return {EventDetails} 201 - success response - application/json
 * @example response - 201 - success response example
 *  {
 *    "message": "L'évènement à bien été enregistré et est en attente de validation",
 *    "body": true
 *  }
 */
router.post('/',
  user_is_connected,
  check_body_exist, body_validator(eventValidation.create),
  push_image('event_pictures'),
  eventController.create
);

/**
 * POST /events/search
 * @summary Search event on post method with event params base on department, category, date or code 
 * @param {Event} request.body.required - event - application/json
 * @security BearerAuth
 * @tags events
 * @return {EventDetails} 200 - success response - application/json
 */
router.post('/search',
  check_body_exist, body_validator(eventValidation.search),
  eventController.search
);

/**
 * PUT /events/{event_id}
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
router.put('/:event_id',
  user_is_connected,
  check_params_exist, params_validator(eventValidation.delete_event),
  isAdmin,
  eventController.validate
);

/**
 * PUT /events/{event_id}/join
 * @summary Request made to the organizer to participate in the event
 * @param {string} event_id.path.required - id mongo of event
 * @security BearerAuth
 * @tags events
 * @return {EventDetails} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "Votre demande de participation à l'évènement à bien été soumis à l'organisateur",
 *    "body": true
 *  }
 */
router.put('/:event_id/join',
  user_is_connected,
  check_body_exist, body_validator(eventValidation.cancel_event),
  userCanParticipateOnEvent,
  eventController.submitParticipation
);

/**
 * PUT /events/{event_id}/leave
 * @summary Request to leave participate in the event
 * @param {string} event_id.path.required - id mongo of event
 * @security BearerAuth
 * @tags events
 * @return {EventDetails} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "Votre participation à l'évenement à été annulé",
 *    "body": true
 *  }
 */
router.put('/:event_id/leave',
  user_is_connected,
  check_body_exist, body_validator(eventValidation.cancel_event),
  ifUserIsAdminEvent,
  userCanCancelParticipationOnEvent,
  eventController.cancelParticipation
);

/**
 * DELETE /events/{event_id}
 * @summary Request to delete an event, only creator event can delete event
 * @param {string} event_id.path.required - id mongo of event
 * @security BearerAuth
 * @tags events
 * @return {EventDetails} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "L'évènement à correctement été annulé",
 *    "body": true
 *  }
 */
router.delete('/:event_id',
  user_is_connected,
  check_params_exist, params_validator(eventValidation.delete_event),
  userCanCancelEvent,
  eventController.cancelEvent
);

module.exports = router;