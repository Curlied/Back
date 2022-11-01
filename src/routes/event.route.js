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

router.post('/', [isConnected, validate(eventValidation.create), push_image('event_pictures'),], eventController.create);
// router.put('/:_id', validate(eventValidation.update), eventController.update);
router.get('/', filterF(filterAllowed), eventController.getAll);
router.get('/filtered', filterF(filterAllowed), eventController.getAllFiltered);

// router.get('/:_id', validate(null), eventController.getOne);
router.get('/detailsevent/:_id', [isConnected, eventExistAndNotDone, ifUserIsAdminEvent, ifUserParticipeOnEvent], eventController.getDetailsEvent);
router.put('/submit-participation', [isConnected, userCanParticipateOnEvent], eventController.submitParticipation);
router.put('/cancel-participation', [isConnected, userCanCancelParticipationOnEvent], eventController.cancelParticipation);
router.delete('/cancel/:_id', [isConnected, userCanCancelEvent], eventController.cancelEvent);

router.get('/:_id/validate', [isConnected, isAdmin], eventController.validate);
router.post('/search', validate(eventValidation.search), eventController.search);


module.exports = router;