import { Router } from 'express';
import * as controller from 'src/controllers/Dashboard.controller';
import adminAuth from 'src/middleware/AdminAuth';

const router = Router();

/**
 * @openapi
 * /dashboard/cash-report:
 *  get:
 *    tags:
 *      - Dashboard
 *    summary: Get the annual report of incomes and expenses
 *    description: This endpoint get the current annual metrics for show incomes and expenses
 *    responses:
 *      200:
 *        description: Object with annual data
 *      400:
 *        description: The box is not open.
 *      401:
 *        description: only admin auth users can access to the information
 *    security:
 *      - bearerAuth: []
 */
router.route('/cash-report').get(adminAuth, controller.cashReport);

/**
 * @openapi
 * /dashboard/annual-report:
 *  get:
 *    tags:
 *      - Dashboard
 *    summary: Get the annual report of incomes and expenses
 *    description: This endpoint get the current annual metrics for show incomes and expenses
 *    parameters:
 *      - name: year
 *        in: query
 *        description: Year of report
 *        required: false
 *        schema:
 *          type: string
 *      - name: operation
 *        in: query
 *        description: Operation type for the report
 *        required: false
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Object with annual data
 *      401:
 *        description: only admin auth users can access to the information
 *    security:
 *      - bearerAuth: []
 */
router.route('/annual-report').get(adminAuth, controller.annualReport);
/**
 * @openapi
 * /dashboard/credit-evolution:
 *  get:
 *    tags:
 *      - Dashboard
 *    summary: Get the annual report of credit evolution
 *    description: This endpoint get sum of credits and payments of last years and anual report of credit and payments
 *    responses:
 *      200:
 *        description: { initialCredit, initialPayment, creditEvolution }
 *      401:
 *        description: only admin auth users can access to the information
 *    security:
 *      - bearerAuth: []
 */
router.route('/credit-evolution').get(controller.creditEvolution);

export default router;
