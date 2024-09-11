import { Router } from 'express';
import * as controller from 'src/controllers/Category.controller';
import formData from 'src/middleware/formData';

const router = Router();
/**
 * Get all categories sort by name
 * @openapi
 * /categories:
 *  get:
 *    tags:
 *      - Category
 *    summary: "Get all categories sort by name"
 *    description: This end point Get all categories sort by name
 *    responses:
 *      '200':
 *        description: Category was store sucessfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                categories:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/categoryLite'
 *      '401':
 *        description: only admins or editors can use this end point.
 *    security:
 *      - bearerAuth: []
 */
router.route('/').get(controller.list);
/**
 * Route for register new category
 * @openapi
 * /categories:
 *  post:
 *    tags:
 *      - Category
 *    summary: Register new category
 *    description: This endpoint register a new category in local database
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/registerCategory'
 *    responses:
 *      '201':
 *        description: Category was store sucessfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                category:
 *                  $ref: '#/components/schemas/categoryLite'
 *      '401':
 *        description: only admins or editors can use this end point.
 *      '422':
 *        description: Invalid Input
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/validationError'
 *    security:
 *      - bearerAuth: []
 */
router.route('/').post(formData, controller.store);
/**
 * Route for register new category
 * @openapi
 * /categories/{categoryId}:
 *  get:
 *    tags:
 *      - Category
 *    summary: Get the category
 *    description: This endpoint get the category of databaes with ID
 *    parameters:
 *      - name: categoryId
 *        in: path
 *        description: category id of find
 *        required: true
 *    responses:
 *      '200':
 *        description: Category data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                category:
 *                  $ref: '#/components/schemas/showCategory'
 *      '401':
 *        description: only admins or editors can use this end point.
 *      '404':
 *        description: Category not found in DB
 *    security:
 *      - bearerAuth: []
 */
router.route('/:categoryId').get(controller.show);
/**
 * Route for register new category
 * @openapi
 * /categories/{categoryId}:
 *  put:
 *    tags:
 *      - Category
 *    summary: Update a category by id
 *    description: This endpoint update the information of category and sort other categories
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/updateCategory'
 *    parameters:
 *      - name: categoryId
 *        in: path
 *        description: category id of find
 *        required: true
 *    responses:
 *      '200':
 *        description: Category data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                category:
 *                  $ref: '#/components/schemas/categoryLite'
 *      '401':
 *        description: only admins or editors can use this end point.
 *      '404':
 *        description: Category not found in DB
 *    security:
 *      - bearerAuth: []
 */
router.route('/:categoryId').put(formData, controller.update);
/**
 * Route for register new category
 * @openapi
 * /categories/{categoryId}:
 *  delete:
 *    tags:
 *      - Category
 *    summary: delete one category of database
 *    description: This endpoint delete a category of database and update the order of other categories.
 *    parameters:
 *      - name: categoryId
 *        in: path
 *        description: category id of find
 *        required: true
 *    responses:
 *      '200':
 *        description: Category deleted
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                category:
 *                  $ref: '#/components/schemas/categoryLite'
 *      '401':
 *        description: only admins or editors can use this end point.
 *      '404':
 *        description: Category not found in DB
 *    security:
 *      - bearerAuth: []
 */
router.route('/:categoryId').delete(controller.destroy);
/**
 * Route for register new category
 * @openapi
 * /categories/update-order:
 *  post:
 *    tags:
 *      - Category
 *    summary: Store the new order of categories
 *    description: This end point store the new order of categories.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/updateCategoryOrderRequest'
 *    responses:
 *      '200':
 *        description: Order is save or not
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                ok:
 *                  type: 'boolean'
 *      '401':
 *        description: only admins or editors can use this end point.
 *    security:
 *      - bearerAuth: []
 */
router.route('/update-order').post(controller.storeNewOrder);

router.route('/combine-clothes').post(controller.combineCategories);

export default router;
