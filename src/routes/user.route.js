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

// ok
router.post('/register', [validate(authValidation.register), isUniqueMail, push_image('users_pictures'),], authController.register);

// ok
router.post('/login', [validate(authValidation.login), isValidate], authController.login);


module.exports = router;