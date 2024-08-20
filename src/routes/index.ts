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

/* 1. User management:
        a. List users
        c. Get user by id
        b. change user role
    
    2. Order management:
        a. List all orders (filter on status)
        b. Change order status
        c. List all orders of give user

    3. Products:
        a. Search API for products (for both users and admins) -> full text search
*/