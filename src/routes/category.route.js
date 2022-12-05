const express = require('express');
const validate = require('../middlewares/validate');
const categoryController = require('../controllers/category.controller');
const categoryValidation = require('../validations/category.validation');
const filterF = require('../middlewares/filter.middleware');
const filterAllowed = ['name', 'description'];

const router = express.Router();


/**
 * @swagger
 * /categories:
 *   get:
 *      produces:
 *        - application/json
 *      summary: Retrieve a list of all event categories
 *      tags: [Categories]
 *      description: Can be used to get a list of possible categories to search for events
 *      responses:
 *       200:
 *         description: the list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
*/
router.get('/', filterF(filterAllowed), categoryController.getAll);

/**
* @swagger
* /categories/{id}:
*   get:
*      produces:
*        - application/json
*      summary: Retrieve a category
*      tags: [Categories]
*      parameters:
*        - in : path
*          name: id
*          description: id of category
*          schema:
*            type: string
*          required: true
*      description: Can be used to get a category by id
*      responses:
*       200:
*         description: the list of the posts
*         content:
*           application/json:
*             schema:
*               type: array
*/
router.get('/:_id', validate(null), categoryController.getOne);

// ok  
router.post('/', validate(categoryValidation.create), categoryController.create);

// ok 
router.put('/:_id', validate(categoryValidation.update), categoryController.update);



module.exports = router;