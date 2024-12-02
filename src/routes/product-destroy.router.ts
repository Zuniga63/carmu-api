import { Router } from 'express';
import * as controller from 'src/controllers/Product.controller';
import adminAuth from 'src/middleware/AdminAuth';

const router = Router();

/**
 * @openapi
 * /products-destroy-all:
 *  delete:
 *    tags:
 *      - Products
 *    summary: Delete all products
 *    description: This endpoint delete all products in the database
 *    responses:
 *      200:
 *        description: The products were deleted successfully
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/').delete(adminAuth, controller.destroyAllProducts);

export default router;
