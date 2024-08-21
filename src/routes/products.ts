import express, { Router } from 'express';
import { createProduct, deleteProduct, getProductById, listProducts, searchProducts, updateProduct } from '../controllers/products';
import { errorHandler } from '../error-handler';
import adminMiddleware from '../middlewares/admin';
import authMiddleware from '../middlewares/auth';

const productsRoutes: Router = express.Router();

productsRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct));
productsRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct));
productsRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));
productsRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listProducts));
productsRoutes.get('/search', [authMiddleware], errorHandler(searchProducts));
productsRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById));

// url/search?q=""

export default productsRoutes;