import { Router } from 'express';
import * as controller from 'src/controllers/SaleHistory.controller';

const router = Router();

/**
 * @openapi
 * /sale-history:
 *  get:
 *    tags:
 *      - Sale Operations
 *    parameters:
 *      - in: query
 *        name: from
 *        schema:
 *          type: Date
 *        description: Date from search
 *      - in: query
 *        name: to
 *        schema:
 *          type: Date
 *        description: Date from search
 *    summary: List of products
 *    description: This endpoint return a list of sale history
 *    responses:
 *      200:
 *        description: The history list is retourned
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

export default router;
