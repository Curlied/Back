const express = require('express');
const validate = require('../middlewares/validate');
const categoryController = require('../controllers/category.controller');
const categoryValidation = require('../validations/category.validation');
const filterF = require('../middlewares/filter.middleware');
const filterAllowed = ['name', 'description'];

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The message of statut.
 *           example: a good message for a good statut
 *         body:
 *           type: object
 *           properties:
 *              name:
 *                type: string
 *                description: Name of category.
 *                example: "shopping"
 *              description:
 *                type: string
 *                description: A little text for describe the category.
 *                example: this is the best activity
 *              url_image:
 *                type: string
 *                description: The url for background image category.
 *                example: https://google.fr
 *              url_icon:
 *                type: string
 *                description: The url for the svg icon category image.
 *                example: https://google.fr
 */



/**
 * @swagger
 * /categories:
 *   get:
 *      produces:
 *        - application/json
 *      summary: Retrieve a list of all categories
 *      tags: [Categories]
 *      description: Can be used to get a list of possible categories to search for events
 *      responses:
 *       200:
 *         description: the list of the category
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
*         description: the list of the category
*         content:
*           application/json:
*             schema:
*               type: array
*/
router.get('/:_id', validate(null), categoryController.getOne);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a JSONPlaceholder user.
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                name:
 *                  type: string
 *                  description: The name of category.
 *                  example: planche a voile
 *                description:
 *                  type: string
 *                  description: A brieve description of category.
 *                  example: sortie en mer pour allez rider
 *                url_image:
 *                  type: string
 *                  description: The url image of category.
 *                  example: https://st.depositphotos.com/1370441/4580/i/600/depositphotos_45801467-stock-photo-windsurfing.jpg
 *                url_icon:
 *                  type: string
 *                  description: The icon who represente these category on website.
 *                  example: https://www.google.com/url?sa=i&url=https%3A%2F%2Ffr.freepik.com%2Ficones-gratuites%2Fplanche-voile-silhouette_729497.htm&psig=AOvVaw3UnNJ62ZzJs4N-dXJ8er2d&ust=1670526582902000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCMiJlMya6PsCFQAAAAAdAAAAABAE
 *     
 *     responses:
 *       200:
 *         description: A response with category.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.post('/', [validate(categoryValidation.create)], categoryController.create);

// ok 
router.put('/:_id', validate(categoryValidation.update), categoryController.update);



module.exports = router;