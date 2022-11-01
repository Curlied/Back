const express = require('express');
const validate = require('../middlewares/validate');
const categoryController = require('../controllers/category.controller');
const categoryValidation = require('../validations/category.validation');
const filterF = require('../middlewares/filter.middleware');
const filterAllowed = ['name', 'description'];

const router = express.Router();

router.post('/', validate(categoryValidation.create), categoryController.create);
router.put('/:_id', validate(categoryValidation.update), categoryController.update);
router.get('/', filterF(filterAllowed), categoryController.getAll);
router.get('/:_id', validate(null), categoryController.getOne);

module.exports = router;