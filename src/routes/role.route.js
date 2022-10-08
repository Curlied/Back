const express = require('express');
const validate = require('../middlewares/validate');
const roleController = require('../controllers/role.controller');
const roleValidation = require('../validations/role.validation');


const router = express.Router();

router.post('/', validate(roleValidation.create), roleController.create);
router.put('/:_id', validate(roleValidation.create), roleController.update);
router.get('/:_id', validate(null), roleController.getOne);
router.get('/', validate(null), roleController.getAll);




module.exports = router;