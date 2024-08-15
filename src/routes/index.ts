import express, { Router } from 'express';
import authRoutes from './auth';
import productsRoutes from './products';

const rootRouter: Router = express.Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);

export default rootRouter;