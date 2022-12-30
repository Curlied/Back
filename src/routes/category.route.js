const express = require('express');
const validate = require('../middlewares/validate');
const categoryController = require('../controllers/category.controller');
const categoryValidation = require('../validations/category.validation');
const filterF = require('../middlewares/filter.middleware');
const filterAllowed = ['name', 'description'];
const {
  isConnected,
} = require('../middlewares/user.middleware');
const router = express.Router();

/**
 * GET /categories
 * @summary Fetch all categories exist for events
 * @param {string} page.query - page to get result
 * @security BearerAuth
 * @tags categories
 * @return {array<Category>} 200 - success response - application/json
 * @example response - 200 - success response example
 *  { 
 *   "message": "OK",
 *   "body": {
 *     "docs": [
 *       {
 *         "_id": "123abc456abc789",
 *         "name": "Parc attraction",
 *         "description": "Envie de sensation à l air libre ?! organisé un évènement dans un parc d attraction.",
 *         "__v": 0,
 *         "url_image": "https://url-image.fr",
 *         "url_icon": "https://url-image.fr"
 *       }
 *     ],
 *     "totalDocs": 10,
 *     "offset": 0,
 *     "limit": 10,
 *     "totalPages": 1,
 *     "page": 1,
 *     "pagingCounter": 1,
 *     "hasPrevPage": false,
 *     "hasNextPage": false,
 *     "prevPage": null,
 *     "nextPage": null
 *   }
 *  }
 */
router.get('/', [isConnected,filterF(filterAllowed)], categoryController.getAll);

/**
 * GET /categories/{id}
 * @summary Return one category by mongo ID
 * @param {string} id.path.required - id mongo of category
 * @security BearerAuth
 * @tags categories
 * @return {array<Category>} 200 - success response - application/json
 * @example response - 200 - success response example
 * {
 *   "message": "OK",
 *   "body": {
 *     "_id": "123abc456abc789",
 *     "name": "Parc attraction",
 *     "description": "Envie de sensation à l air libre ?! organisé un évènement dans un parc d attraction.",
 *     "__v": 0,
 *     "url_image": "https://url-image.fr",
 *     "url_icon": "https://url-image.fr"
 *   }
 * }
 */
router.get('/:_id',[isConnected,validate(null)], categoryController.getOne);

/**
 * POST /categories
 * @summary Create a type of categorie for event
 * @param {Category} request.body.required - category info - application/json
 * @security BearerAuth
 * @tags categories
 * @return {array<Category>} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "La catégorie à bien été créée",
 *    "body": {
 *      "name": "amusement",
 *      "description": "soirée kiwi à la maison",
 *      "url_image": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Ffr%2Fphotos%2Fboum&psig=AOvVaw3ArECSy1QM0W8JCFMlH7ov&ust=1671103563768000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCKiU_YOA-fsCFQAAAAAdAAAAABAE",
 *      "url_icon": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fribambelle.fr%2Fanimations%2Fmini-boum&psig=AOvVaw3bC2PXYZXAN9kSXOq3nsi-&ust=1671103549460000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLj9if3_-PsCFQAAAAAdAAAAABAE",
 *      "_id": "0000ab1c23548d987d51d",
 *      "__v": 0
 *    }
 *  }
 */
router.post('/', [isConnected,validate(categoryValidation.create)], categoryController.create);

/**
 * PUT /categories/{id}
 * @summary Update category information by id Mongo
 * @param {string} id.path.required - id mongo of category
 * @param {Category} request.body.required - category info - application/json
 * @security BearerAuth
 * @tags categories
 * @return {array<Category>} 200 - success response - application/json
 * @example response - 200 - success response example
 *  {
 *    "message": "La catégorie à bien été mise à jour",
 *    "body": {
 *      "name": "amusement",
 *      "description": "soirée kiwi à la maison",
 *      "url_image": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Ffr%2Fphotos%2Fboum&psig=AOvVaw3ArECSy1QM0W8JCFMlH7ov&ust=1671103563768000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCKiU_YOA-fsCFQAAAAAdAAAAABAE",
 *      "url_icon": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fribambelle.fr%2Fanimations%2Fmini-boum&psig=AOvVaw3bC2PXYZXAN9kSXOq3nsi-&ust=1671103549460000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLj9if3_-PsCFQAAAAAdAAAAABAE",
 *      "_id": "0000ab1c23548d987d51d",
 *      "__v": 0
 *    }
 *  }
 */
router.put('/:_id',[isConnected, validate(categoryValidation.update)], categoryController.update);



module.exports = router;