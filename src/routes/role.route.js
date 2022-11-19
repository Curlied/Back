const router = require('express').Router();
const { body_validator } = require('../middlewares/validate');
const roleController = require('../controllers/role.controller');
const roleValidation = require('../validations/role.validation');

// import common middlewares
const { check_body_exist } = require('../middlewares/common');

router.post('/', check_body_exist, body_validator(roleValidation.create), roleController.create);
router.put('/:_id', body_validator(roleValidation.create), roleController.update);
router.get('/:_id', check_body_exist, body_validator(null), roleController.getOne);
router.get('/', body_validator(null), roleController.getAll);

module.exports = router;