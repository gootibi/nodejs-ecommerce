import express, { Router } from 'express';
import authRoutes from './auth';
import productsRoutes from './products';
import usersRoutes from './users';
import cartRouter from './cart';
import orderRouter from './orders';

const rootRouter: Router = express.Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/users', usersRoutes);
rootRouter.use('/carts', cartRouter);
rootRouter.use('/orders', orderRouter);

export default rootRouter;