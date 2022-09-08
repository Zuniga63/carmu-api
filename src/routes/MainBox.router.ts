import { Router } from 'express';
import * as controller from 'src/controllers/MainBox.controller';

const router = Router();

/**
 * @openapi
 * /main-box/transactions:
 *  get:
 *    tags:
 *      - 'Main Box'
 *    summary: Get all transactions
 *    description: This end point get the array of transaction sort by transactionDate
 *    responses:
 *      200:
 *        description: List of transaction.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transactions:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/transaction'
 *      401:
 *        description: only the admins can access to end point
 *    security:
 *      - bearerAuth: []
 */
router.route('/transactions').get(controller.transactionList);
/**
 * @openapi
 * /main-box/closing-list:
 *  get:
 *    tags:
 *      - 'Main Box'
 *    summary: Get all cash closing
 *    description: This end point get the array of cash cloisng sort by closingDate
 *    responses:
 *      200:
 *        description: List of cash closing.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                closings:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/closingRecordWithRef'
 *      401:
 *        description: only the admins can access to end point
 *    security:
 *      - bearerAuth: []
 */
router.route('/closing-list').get(controller.closingList);
/**
 * @openapi
 * /main-box/closing-list/{closingId}/transactions:
 *  get:
 *    tags:
 *      - 'Main Box'
 *    summary: Get all transactions
 *    description: This end point get the array of transaction sort by transactionDate
 *    parameters:
 *      - name: closingId
 *        in: path
 *        description: The id of box of search
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: List of transaction.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transactions:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/transaction'
 *      401:
 *        description: only the admins can access to end point
 *    security:
 *      - bearerAuth: []
 */
router.route('/closing-list/:closingId/transactions').get(controller.closingTransactions);

export default router;
