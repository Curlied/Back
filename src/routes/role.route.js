const router = require('express').Router();
const roleController = require('../controllers/role.controller');
const roleValidation = require('../validations/role.validation');

// import common middlewares
const { check_body_exist, check_params_exist } = require('../middlewares/common');
const { body_validator, params_validator } = require('../middlewares/validate');

router.post('/',
  check_body_exist,
  body_validator(roleValidation.create),
  roleController.create
);

router.put('/:role_id',
  check_params_exist,
  params_validator(roleValidation.update),
  check_body_exist,
  body_validator(roleValidation.update),
  roleController.update
);

router.get('/:role_id',
  check_params_exist,
  params_validator(roleValidation.retrieve),
  roleController.getOne
);

router.get('/',
  roleController.getAll
);

module.exports = router;