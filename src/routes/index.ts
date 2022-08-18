import { Router } from 'express';
import editorAuth from 'src/middleware/editorAuth';
import AuthRouter from './Auth.router';
import CategoryRouter from './category.router';

const rootRouter = Router();

rootRouter.use('/auth', AuthRouter);
rootRouter.use('/categories', editorAuth, CategoryRouter);

export default rootRouter;
