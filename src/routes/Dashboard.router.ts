import { Router } from 'express';
import * as controller from 'src/controllers/Dashboard.controller';

const router = Router();

router.route('/cash-report').get(controller.cashReport);

export default router;
