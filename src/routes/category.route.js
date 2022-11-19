const router = require('express').Router();
const { body_validator } = require('../middlewares/validate');
const categoryController = require('../controllers/category.controller');
const categoryValidation = require('../validations/category.validation');
const filterF = require('../middlewares/filter.middleware');
const filterAllowed = ['name', 'description'];

// import common middlewares
const { check_body_exist } = require('../middlewares/common');

router.post('/', check_body_exist, body_validator(categoryValidation.create), categoryController.create);
router.put('/:_id', check_body_exist, body_validator(categoryValidation.update), categoryController.update);
router.get('/', filterF(filterAllowed), categoryController.getAll);
router.get('/:_id', check_body_exist, body_validator(null), categoryController.getOne);

module.exports = router;