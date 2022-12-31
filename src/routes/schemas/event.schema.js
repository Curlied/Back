/** 
 * @typedef {object} Event
 * @property {string} category
 * @property {string} code
 * @property {string} date_time
 * @property {string} department
 * @property {string} description
 * @property {string} name
 * @property {string} place
 * @property {number} price
 * @property {number} time
 * @property {string[]} url_image
 * @property {number} user_max
 */


/** 
 * @typedef {object} EventDetails
 * @property {object} creator
 * @property {string} name
 * @property {Category} category
 * @property {string} date_time
 * @property {number} user_max
 * @property {string} place
 * @property {number} time
 * @property {number} price
 * @property {string} description
 * @property {boolean} is_validate
 * @property {string} created_at
 * @property {string} code
 * @property {string} department
 * @property {string[]} url_image
 * @property {object[]} users_waiting
 * @property {string} users_waiting.user_id
 * @property {object[]} users_valide
 * @property {string} users_valide.user_id
 * @property {boolean} CurrentUserIsAdmin
 */
