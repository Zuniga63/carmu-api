import { Router } from 'express';
import * as controller from 'src/controllers/Store.controller';
import adminAuth from 'src/middleware/AdminAuth';
import userAuth from 'src/middleware/UserAuth';

const router = Router();

router.route('/').get(userAuth, controller.list);
router.route('/').post(adminAuth, controller.store);
router.route('/:storeId').patch(userAuth, controller.update);

export default router;
