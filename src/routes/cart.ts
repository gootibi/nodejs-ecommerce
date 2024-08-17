import express, { Router } from 'express';
import { addItemToCart, deleteItemFromCart, changeQuantity, getCart } from '../controllers/cart';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
const cartRouter: Router = express.Router();

cartRouter.post('/', [authMiddleware], errorHandler(addItemToCart));
cartRouter.get('/', [authMiddleware], errorHandler(getCart));
cartRouter.put('/:id', [authMiddleware], errorHandler(changeQuantity));
cartRouter.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart));

export default cartRouter;