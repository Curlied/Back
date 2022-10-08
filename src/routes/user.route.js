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

router.post('/register', [validate(authValidation.register), isUniqueMail, push_image('users_pictures'), ], authController.register);
router.post('/login', [validate(authValidation.login), isValidate], authController.login);
router.get('/confirm', authController.confirm);
router.get('/disconnect', [isConnected], authController.disconnect);
router.get('/space-user/my-profil', [isConnected], userController.myProfilDetailsUsers);
router.get('/space-user/personal-infos', [isConnected], userController.personalInformationsDetailsUser);
router.get('/space-user/all-events', [isConnected], userController.getAllEventsFromSpaceUser);
router.get('/roles', [isConnected], userController.getRoles);

module.exports = router;