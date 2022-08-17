import { Router } from 'express';
import * as controller from 'src/controllers/Category.controller';

const router = Router();

router.route('/').get(controller.list);
router.route('/').post(controller.store);
router.route('/:id').get(controller.show);
router.route('/:id').put(controller.update);
router.route('/:id').delete(controller.destroy);
