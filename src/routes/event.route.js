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


router.get('/', filterF(filterAllowed), eventController.getAll);

// nok should be events/:_id
router.get('/detailsevent/:_id', [isConnected, eventExistAndNotDone, ifUserIsAdminEvent, ifUserParticipeOnEvent], eventController.getDetailsEvent); 

router.get('/filtered', filterF(filterAllowed), eventController.getAllFiltered);

// should be put for update an event
router.get('/:_id/validate', [isConnected, isAdmin], eventController.validate);

router.post('/search', validate(eventValidation.search), eventController.search);
router.post('/', [isConnected, validate(eventValidation.create), push_image('event_pictures'), ], eventController.create);

router.put('/submit-participation', [isConnected, userCanParticipateOnEvent], eventController.submitParticipation);
router.put('/cancel-participation', [isConnected, userCanCancelParticipationOnEvent], eventController.cancelParticipation);

// should be delete without word cancel : events/id on delete action.
router.delete('/cancel/:_id', [isConnected, userCanCancelEvent], eventController.cancelEvent);

// router.get('/:_id', validate(null), eventController.getOne);
// router.put('/:_id', validate(eventValidation.update), eventController.update);






module.exports = router;