import { Router } from 'express';
import editorAuth from 'src/middleware/editorAuth';
import userAuth from 'src/middleware/UserAuth';
import adminAuth from 'src/middleware/AdminAuth';
import AuthRouter from './Auth.router';
import CategoryRouter from './category.router';
import CashboxRouter from './Cashbox.router';
import MainBoxRouter from './MainBox.router';
import DashboardRouter from './Dashboard.router';
import CustomerRouter from './Customer.router';
import ProductRouter from './Product.router';

const rootRouter = Router();

rootRouter.use('/dashboard', DashboardRouter);
rootRouter.use('/auth', AuthRouter);
rootRouter.use('/categories', editorAuth, CategoryRouter);
rootRouter.use('/boxes', userAuth, CashboxRouter);
rootRouter.use('/main-box', adminAuth, MainBoxRouter);
rootRouter.use('/customers', userAuth, CustomerRouter);
rootRouter.use('/products', ProductRouter);

export default rootRouter;
