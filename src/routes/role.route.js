const express = require('express');
const validate = require('../middlewares/validate');
const roleController = require('../controllers/role.controller');
const roleValidation = require('../validations/role.validation');


const router = express.Router();

// all these path are not protect with isconnect middleware ? 
// any users can change or update roles. 


router.get('/', validate(null), roleController.getAll);

router.get('/:_id', validate(null), roleController.getOne);

router.post('/', validate(roleValidation.create), roleController.create);

router.put('/:_id', validate(roleValidation.create), roleController.update);






module.exports = router;