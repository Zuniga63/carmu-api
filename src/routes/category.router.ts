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
 *    sumary: "Get all categories sort by name"
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
 *                    $ref: '#/components/schemas/newCategory'
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
 *    sumary: Register new category
 *    description: This end point register a new category in local database
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
 *                  $ref: '#/components/schemas/newCategory'
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
router.route('/:id').get(controller.show);
router.route('/:id').put(controller.update);
router.route('/:id').delete(controller.destroy);

export default router;
