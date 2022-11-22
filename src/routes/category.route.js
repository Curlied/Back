const express = require('express');
const validate = require('../middlewares/validate');
const categoryController = require('../controllers/category.controller');
const categoryValidation = require('../validations/category.validation');
const filterF = require('../middlewares/filter.middleware');
const filterAllowed = ['name', 'description'];

const router = express.Router();


// ok 
router.get('/', filterF(filterAllowed), categoryController.getAll); 

// ok 
router.get('/:_id', validate(null), categoryController.getOne);

// ok  
router.post('/', validate(categoryValidation.create), categoryController.create);

// ok 
router.put('/:_id', validate(categoryValidation.update), categoryController.update);



module.exports = router;