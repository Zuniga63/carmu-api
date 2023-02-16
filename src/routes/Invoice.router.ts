import { Router } from 'express';
import * as controller from 'src/controllers/Invoice.controller';

const router = Router();

/**
 * @openapi
 * /invoices:
 *  get:
 *    tags:
 *      - Invoices
 *    summary: List of invoices
 *    description: This endpoint return a list of invoice sort by expedition date
 *    responses:
 *      200:
 *        description: The customer list is returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                invoices:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/invoice'
 *                customers:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/customer'
 *                categories:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      name:
 *                        type: string
 *                products:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      name:
 *                        type: string
 *                      categories:
 *                        type: array
 *                        items:
 *                          type: string
 *                      tags:
 *                        type: array
 *                        items:
 *                          type: string
 *                      ref:
 *                        type: string
 *                      barcode:
 *                        type: string
 *
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/').get(controller.list);
/**
 * @openapi
 * /invoices:
 *  post:
 *    tags:
 *      - Invoices
 *    summary: Store new invoice
 *    description: This endpoint store a new invoices in the database
 *    requestBody:
 *      description: Data of invoice
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/storeInvoice'
 *    responses:
 *      201:
 *        description: The customer list is returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                invoice:
 *                  $ref: '#/components/schemas/invoice'
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
 *
 */
router.route('/').post(controller.store);
/**
 * @openapi
 * /invoices/{invoiceId}:
 *  get:
 *    tags:
 *      - Invoices
 *    summary: Store new invoices
 *    description: This endpoint store a new invoices in the database
 *    parameters:
 *      - name: invoiceId
 *        in: path
 *        description: The id of invoice to search
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The customer list is returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                invoices:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/invoice'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/:invoiceId').get(controller.show);
/**
 * @openapi
 * /invoices/{invoiceId}/add-payment:
 *  post:
 *    tags:
 *      - Invoices
 *    summary: Store new payment in the invoice
 *    description: This endpoint store a new payment in the invoices and create the resports necesary
 *    parameters:
 *      - name: invoiceId
 *        in: path
 *        description: The id of invoice to add payment
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Data of new payment
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/addInvoicePayment'
 *    responses:
 *      200:
 *        description: The payment, items affected and message is returned.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                payment:
 *                  $ref: '#/components/schemas/addPaymentResponse'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/:invoiceId/add-payment').post(controller.addPayment);
router.route('/:invoiceId/payments/:paymentId/cancel-payment').put(controller.cancelPayment);
router.route('/:invoiceId/cancel').put(controller.cancelInvoice);

export default router;
