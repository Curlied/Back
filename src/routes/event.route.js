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

router.post('/',
  user_is_connected,
  check_body_exist, body_validator(eventValidation.create),
  push_image('event_pictures'),
  eventController.create
);

router.get('/',
  filterF(filterAllowed),
  eventController.getAll
);

router.get('/detailsevent/:event_id',
  user_is_connected,
  check_params_exist, params_validator(eventValidation.retrieve),
  eventExistAndNotDone,
  ifUserIsAdminEvent,
  ifUserParticipeOnEvent,
  eventController.getDetailsEvent
);

router.put('/submit-participation',
  user_is_connected,
  check_body_exist, body_validator(eventValidation.cancel_event),
  userCanParticipateOnEvent,
  eventController.submitParticipation
);

router.put('/cancel-participation',
  user_is_connected,
  check_body_exist, body_validator(eventValidation.cancel_event),
  ifUserIsAdminEvent,
  userCanCancelParticipationOnEvent,
  eventController.cancelParticipation
);

router.delete('/cancel/:event_id',
  user_is_connected,
  check_params_exist, params_validator(eventValidation.delete_event),
  userCanCancelEvent,
  eventController.cancelEvent
);

router.get('/:event_id/validate',
  user_is_connected,
  check_params_exist, params_validator(eventValidation.delete_event),
  isAdmin,
  eventController.validate
);

router.post('/search',
  check_body_exist, body_validator(eventValidation.search),
  eventController.search
);

module.exports = router;