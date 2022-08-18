import { Router } from 'express';
import AuthRouter from './Auth.router';
import CategoryRouter from './category.router';

const rootRouter = Router();

rootRouter.use('/auth', AuthRouter);
rootRouter.use('/categories', CategoryRouter);

export default rootRouter;
