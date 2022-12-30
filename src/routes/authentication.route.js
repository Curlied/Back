const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');

const {
  push_image
} = require('../middlewares/digitalocean.middleware');
const {
  isUniqueMail,
  isValidate,
  user_is_connected
} = require('../middlewares/user.middleware');

// import common middlewares
const { check_body_exist, check_query_exist } = require('../middlewares/common');
const { body_validator, query_validator } = require('../middlewares/validate');

router.post('/register',
  check_body_exist, body_validator(authValidation.register),
  isUniqueMail,
  push_image('users_pictures'),
  authController.register
);

router.post('/login',
  check_body_exist, body_validator(authValidation.login),
  isValidate,
  authController.login
);

router.get('/confirm',
  check_query_exist, query_validator(authValidation.register),
  authController.email_confirmation
);

router.get('/disconnect',
  user_is_connected,
  authController.disconnect
);

module.exports = router;