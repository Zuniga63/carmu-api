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
 * /main-box/transactions:
 *  post:
 *    tags:
 *      - Main Box
 *    summary: Add new transaction in the global list of transactions
 *    description: This end point add a new transaction in the box
 *    requestBody:
 *      description: Add new box in the databe
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/newTransactionRequest'
 *    responses:
 *      200:
 *        description: Transaction created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transaction:
 *                  $ref: '#/components/schemas/transaction'
 *      400:
 *        description: The box is not open.
 *      401:
 *        description: only auth users can acces the information
 *      404:
 *        description: The box not found.
 *      422:
 *        description: Invalid Input
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/validationError'
 *    security:
 *      - bearerAuth: []
 */
router.route('/transactions').post(controller.addTransaction);
/**
 * @openapi
 * /main-box/transactions/{transactionId}:
 *  delete:
 *    tags:
 *      - 'Main Box'
 *    summary: Delete transaction by ID
 *    description: This end point transaction the transaction in data base
 *    parameters:
 *      - name: transactionId
 *        in: path
 *        description: The id of transaction to update
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Transaction deleted
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                transaction:
 *                  $ref: '#/components/schemas/transaction'
 *      400:
 *        description: The box is not open, the transaction is a transfer
 *      401:
 *        description: only admin users can acces the information
 *      404:
 *        description: The box or trnasaction not found.
 *    security:
 *      - bearerAuth: []
 */
router.route('/transactions/:transactionId').delete(controller.destroyTransaction);
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
