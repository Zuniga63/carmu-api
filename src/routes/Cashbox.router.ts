import { Router } from 'express';
import * as controller from 'src/controllers/Cashbox.controller';

const router = Router();

/**
 * @openapi
 * /boxes:
 *  get:
 *    tags:
 *      - Boxes
 *    summary: Get all boxes sort by name
 *    description: This endpoint get the lite boxes sort by name in the database
 *    responses:
 *      200:
 *        description: List of boxes that actual user can see
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                boxes:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/cashboxLite'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 */
router.route('/').get(controller.list);
/**
 * @openapi
 * /boxes:
 *  post:
 *    tags:
 *      - Boxes
 *    summary: Add new box
 *    description: This end point save a new box in the database
 *    requestBody:
 *      description: Add new box in the databe
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/newCashboxRequest'
 *
 *    responses:
 *      '201':
 *        description: The new box was created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cashbox:
 *                  $ref: '#/components/schemas/fullCashbox'
 *      401:
 *        description: only auth users can acces the information
 *      422:
 *        description: Invalid Input
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/validationError'
 *    security:
 *      - bearerAuth: []
 */
router.route('/').post(controller.store);
/**
 * @openapi
 * /boxes/{boxId}:
 *  get:
 *    tags:
 *      - Boxes
 *    summary: Get the cashbox by Id
 *    description: This end point get the all information of cashbox
 *    parameters:
 *      - name: boxId
 *        in: path
 *        description: The id of box of search
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The cashbox data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cashbox:
 *                  $ref: '#/components/schemas/fullCashbox'
 *      401:
 *        description: only auth users can acces the information
 *      404:
 *        description: The cashbox not found in the database
 *    security:
 *      - bearerAuth: []
 */
router.route('/:boxId').get(controller.show);
/**
 * @openapi
 * /boxes/{boxId}:
 *  put:
 *    tags:
 *      - Boxes
 *    summary: Update the cashbox in the database
 *    description: This end point update the name of cashbox
 *    parameters:
 *      - name: boxId
 *        in: path
 *        description: The id of box of search
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Add new box in the databe
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/updateCashboxRequest'
 *    responses:
 *      200:
 *        description: The cashbox data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/updateCashboxResponse'
 *      401:
 *        description: only auth users can acces the information
 *      404:
 *        description: The cashbox not found in the database
 *    security:
 *      - bearerAuth: []
 */
router.route('/:boxId').put(controller.update);
/**
 * @openapi
 * /boxes/{boxId}:
 *  delete:
 *    tags:
 *      - Boxes
 *    summary: Remove the cashbox of databse
 *    description: This end point remove the cashbox of database and delete the reference in the user and transactions
 *    parameters:
 *      - name: boxId
 *        in: path
 *        description: The id of box of search
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The cashbox was delete
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/updateCashboxResponse'
 *      401:
 *        description: only auth users can acces the information
 *      404:
 *        description: The cashbox not found in the database
 *    security:
 *      - bearerAuth: []
 */
router.route('/:boxId').delete(controller.destroy);
/**
 * @openapi
 * /boxes/{boxId}/open:
 *  put:
 *    tags:
 *      - Boxes
 *    summary: Start a close box with a cashier
 *    description: This end point init a box for start register transactions.
 *    parameters:
 *      - name: boxId
 *        in: path
 *        description: The id of box init
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Cashier and new base of box.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/openBoxRequest'
 *    responses:
 *      200:
 *        description: The result of operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/openBoxResponse'
 *      400:
 *        description: The box is open
 *      401:
 *        description: Session expired or unauthorize
 *      404:
 *        description: The cashbox or the cashier not found in the database
 *      422:
 *        description: Invalid Input
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/validationError'
 *    security:
 *      - bearerAuth: []
 */
router.route('/:boxId/open').put(controller.openBox);
/**
 * @openapi
 * /boxes/{boxId}/close:
 *  put:
 *    tags:
 *      - Boxes
 *    summary: Close a open box
 *    description: This end point close and reset a open box
 *    parameters:
 *      - name: boxId
 *        in: path
 *        description: The id of box to close
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Cash count in the box and observatión
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/closeBoxRequest'
 *    responses:
 *      200:
 *        description: The result of operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/closeBoxResponse'
 *      400:
 *        description: The box is not open
 *      401:
 *        description: Session expired or unauthorize
 *      404:
 *        description: The cashbox not found in the database
 *      422:
 *        description: Invalid Input
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/validationError'
 *    security:
 *      - bearerAuth: []
 */
router.route('/:boxId/close').put(controller.closeBox);
/**
 * @openapi
 * /boxes/{boxId}/transactions:
 *  get:
 *    tags:
 *      - Boxes
 *    summary: Get all transactions of cashbox
 *    description: This end point get the array of transaction sort by transactionDate
 *    parameters:
 *      - name: boxId
 *        in: path
 *        description: The id of box of search
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
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
 *      400:
 *        description: The box is not open.
 *      401:
 *        description: only auth users can acces the information
 *      404:
 *        description: The box not found.
 *    security:
 *      - bearerAuth: []
 */
router.route('/:boxId/transactions').get(controller.listTransactions);
/**
 * @openapi
 * /boxes/{boxId}/transactions:
 *  post:
 *    tags:
 *      - Boxes
 *    summary: Add new transaction in the open box
 *    description: This end point add a new transaction in the box
 *    parameters:
 *      - name: boxId
 *        in: path
 *        description: The id of box
 *        required: true
 *        schema:
 *          type: string
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
router.route('/:boxId/transactions').post(controller.addTransaction);
/**
 * @openapi
 * /boxes/{boxId}/transactions/{transactionId}:
 *  put:
 *    tags:
 *      - Boxes
 *    summary: Update transaction by ID
 *    description: This end point update the transaction in data base
 *    parameters:
 *      - name: boxId
 *        in: path
 *        description: The id of box
 *        required: true
 *        schema:
 *          type: string
 *      - name: transactionId
 *        in: path
 *        description: The id of transaction to update
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Add new box in the databe
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/newTransactionRequest'
 *    responses:
 *      200:
 *        description: Transaction updated
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
 *        description: only auth users can acces the information
 *      404:
 *        description: The box or trnasaction not found.
 *      422:
 *        description: Invalid Input
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/validationError'
 *    security:
 *      - bearerAuth: []
 */
router.route('/:boxId/transactions/:transactionId').put(controller.updateTransaction);
/**
 * @openapi
 * /boxes/{boxId}/transactions/{transactionId}:
 *  delete:
 *    tags:
 *      - Boxes
 *    summary: Delete transaction by ID
 *    description: This end point transaction the transaction in data base
 *    parameters:
 *      - name: boxId
 *        in: path
 *        description: The id of box
 *        required: true
 *        schema:
 *          type: string
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
 *        description: only auth users can acces the information
 *      404:
 *        description: The box or trnasaction not found.
 *    security:
 *      - bearerAuth: []
 */
router.route('/:boxId/transactions/:transactionId').delete(controller.destroyTransaction);

export default router;
