import express, { Router } from 'express';
import { cancelOrder, createOrder, getOrderById, listOrders } from '../controllers/orders';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
const orderRouter: Router = express.Router();

orderRouter.post('/',[authMiddleware], errorHandler(createOrder));
orderRouter.get('/',[authMiddleware], errorHandler(listOrders));
orderRouter.put('/:id/cancel',[authMiddleware], errorHandler(cancelOrder));
orderRouter.get('/:id',[authMiddleware], errorHandler(getOrderById));

export default orderRouter;