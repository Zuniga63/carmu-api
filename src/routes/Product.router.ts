import { Router } from 'express';
import * as controller from 'src/controllers/Product.controller';
import adminAuth from 'src/middleware/AdminAuth';
import formData from 'src/middleware/formData';
import userAuth from 'src/middleware/UserAuth';

const router = Router();

/**
 * @openapi
 * /products:
 *  get:
 *    tags:
 *      - Products
 *    summary: List of products
 *    description: This endpoint return a list of products sort by name
 *    responses:
 *      200:
 *        description: The product list is returned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/productList'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/').get(controller.list);
/**
 * @openapi
 * /products:
 *  post:
 *    tags:
 *      - Products
 *    summary: Add new product
 *    description: This endpoint add new product in the database
 *    requestBody:
 *      description: Data of customer to store.
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/newProduct'
 *    responses:
 *      201:
 *        description: The product was stored successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                product:
 *                  $ref: '#/components/schemas/product'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/').post(userAuth, formData, controller.store);
/**
 * @openapi
 * /products/{productId}:
 *  get:
 *    tags:
 *      - Products
 *    summary: Get one product
 *    description: This endpoint return a intance of product
 *    parameters:
 *      - name: productId
 *        in: path
 *        description: The id of product to find
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The product instance
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                product:
 *                  $ref: '#/components/schemas/productList'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/:productId').get(controller.show);
/**
 * @openapi
 * /products/{productId}:
 *  put:
 *    tags:
 *      - Products
 *    summary: Update the product
 *    description: This endpoint update a existing product in the database
 *    parameters:
 *      - name: productId
 *        in: path
 *        description: The id of product to update
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Data of product to update.
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/udpateProduct'
 *    responses:
 *      200:
 *        description: The product was updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                product:
 *                  $ref: '#/components/schemas/product'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/:productId').put(userAuth, formData, controller.update);
/**
 * @openapi
 * /products/{productId}:
 *  delete:
 *    tags:
 *      - Products
 *    summary: Delete the product
 *    description: This endpoint delete the product and refs.
 *    parameters:
 *      - name: productId
 *        in: path
 *        description: The id of product to delete
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The product delete instance
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                product:
 *                  $ref: '#/components/schemas/productList'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/:productId').delete(adminAuth, controller.destroy);

export default router;
