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

export default router;
