import { Router } from 'express';
import * as controller from 'src/controllers/Customer.controller';
import adminAuth from 'src/middleware/AdminAuth';

const router = Router();
/**
 * @openapi
 * /customers:
 *  get:
 *    tags:
 *      - Customers
 *    summary: List of customer in the database
 *    description: This endpoint return a list of customer sort by first name and last name
 *    responses:
 *      200:
 *        description: The customer list is returned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/customerList'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/').get(controller.list);
/**
 * @openapi
 * /customers:
 *  post:
 *    tags:
 *      - Customers
 *    summary: Add new customer
 *    description: This endpoint save a new customer in the database
 *    requestBody:
 *      description: Data of customer to store.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/storeCustomerRequest'
 *    responses:
 *      201:
 *        description: The new customer was created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/storeCustomerResponse'
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
 * /customers/{customerId}:
 *  get:
 *    tags:
 *      - Customers
 *    summary: Information of customer
 *    description: This endpoint return a unique customer data
 *    parameters:
 *      - name: customerId
 *        in: path
 *        description: The id of customer to delete
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The new customer was created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                customer:
 *                  $ref: '#/components/schemas/customerWithInvoices'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/:customerId').get(controller.show);
/**
 * @openapi
 * /customers/{customerId}:
 *  put:
 *    tags:
 *      - Customers
 *    summary: Update the customer data
 *    description: This endpoint update the customer in the database
 *    parameters:
 *      - name: customerId
 *        in: path
 *        description: The id of customer to update
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Data of customer to update.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/updateCustomerRequest'
 *    responses:
 *      200:
 *        description: The update customer is returned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/storeCustomerResponse'
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
router.route('/:customerId').put(controller.update);
/**
 * @openapi
 * /customers/{customerId}:
 *  delete:
 *    tags:
 *      - Customers
 *    summary: Remove customer by ID
 *    description: This endpoint remove a customer using the ID
 *    parameters:
 *      - name: customerId
 *        in: path
 *        description: The id of customer to delete
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The customer was delete successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                ok:
 *                  type: boolean
 *                  example: true
 *      401:
 *        description: only auth users can acces the information
 *      404:
 *        description: Customer not found
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/:customerId').delete(adminAuth, controller.destroy);
/**
 * @openapi
 * /customers/{customerId}/contacts:
 *  post:
 *    tags:
 *      - Customers
 *    summary: Add new contact to customer
 *    description: This endpoint add new contact in the customer contact
 *    parameters:
 *      - name: customerId
 *        in: path
 *        description: The id of customer to update
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Data of customer to update.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/addContactRequest'
 *    responses:
 *      201:
 *        description: The new contact was added
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/contactResponse'
 *      401:
 *        description: only auth users can acces the information
 *      404:
 *        description: The customer not found
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
router.route('/:customerId/contacts').post(controller.addContact);
/**
 * @openapi
 * /customers/{customerId}/contacts/{contactId}:
 *  delete:
 *    tags:
 *      - Customers
 *    summary: Remove the contact of customer
 *    description: This endpoint remove the contact in the customer
 *    parameters:
 *      - name: customerId
 *        in: path
 *        description: The id of customer to update
 *        required: true
 *        schema:
 *          type: string
 *      - name: contactId
 *        in: path
 *        description: The id of contact to delete
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The contact was deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/contactResponse'
 *      401:
 *        description: only auth users can acces the information
 *      404:
 *        description: The customer or contact not found
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/:customerId/contacts/:contactId').delete(controller.removeContact);
/**
 * @openapi
 * /customers/{customerId}/add-credit-payment:
 *  post:
 *    tags:
 *      - Customers
 *    summary: Store new payment to credits
 *    description: This endpoint store a new payment to invoices of customer
 *    parameters:
 *      - name: customerId
 *        in: path
 *        description: The id of customer to payment
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
 *                paymentReports:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/customerPaymentReport'
 *      401:
 *        description: only auth users can acces the information
 *    security:
 *      - bearerAuth: []
 *
 */
router.route('/:customerId/add-credit-payment').post(controller.addPayment);

export default router;
