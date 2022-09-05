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
 *    description: This end point get the lite boxes sort by name in the database
 *    responses:
 *      '200':
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
 *              $ref: '#/components/schemas/fullCashbox'
 *      401:
 *        description: only auth users can acces the information
 *      404:
 *        description: The cashbox not found in the database
 *    security:
 *      - bearerAuth: []
 */
router.route('/:boxId').delete(controller.destroy);

export default router;
