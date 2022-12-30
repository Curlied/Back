const router = require('express').Router();
const userController = require('../controllers/user.controller');

// import common middlewares
const { user_is_connected } = require('../middlewares/user.middleware');

router.get('/space-user/my-profil',
  user_is_connected,
  userController.myProfilDetailsUsers
);

router.get('/space-user/personal-infos',
  user_is_connected,
  userController.personalInformationsDetailsUser
);

router.get('/space-user/all-events',
  user_is_connected,
  userController.getAllEventsFromSpaceUser
);

router.get('/roles',
  user_is_connected,
  userController.getRoles
);

module.exports = router;