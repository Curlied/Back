const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const categoryValidation = require('../validations/category.validation');
const filterF = require('../middlewares/filter.middleware');
const filterAllowed = ['name', 'description'];

// import common middlewares
const { check_body_exist, check_params_exist } = require('../middlewares/common');
const { body_validator, params_validator } = require('../middlewares/validate');

router.post('/',
  check_body_exist, body_validator(categoryValidation.create),
  categoryController.create
);

router.put('/:category_id',
  check_params_exist, params_validator(categoryValidation.update),
  check_body_exist, body_validator(categoryValidation.update),
  categoryController.update
);

router.get('/:category_id',
  check_params_exist, params_validator(categoryValidation.retrieve),
  categoryController.getOne
);

router.get('/', filterF(filterAllowed),
  categoryController.getAll
);

module.exports = router;