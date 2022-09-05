import { Router } from 'express';
import editorAuth from 'src/middleware/editorAuth';
import userAuth from 'src/middleware/UserAuth';
import AuthRouter from './Auth.router';
import CategoryRouter from './category.router';
import CashboxRouter from './Cashbox.router';

const rootRouter = Router();

rootRouter.use('/auth', AuthRouter);
rootRouter.use('/categories', editorAuth, CategoryRouter);
rootRouter.use('/boxes', userAuth, CashboxRouter);

export default rootRouter;
