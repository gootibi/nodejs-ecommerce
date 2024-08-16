import express, { Router } from 'express';
import { addAddress, deleteAddress, listAddress } from '../controllers/users';
import { errorHandler } from '../error-handler';
import adminMiddleware from '../middlewares/admin';
import authMiddleware from '../middlewares/auth';

const usersRoutes: Router = express.Router();

usersRoutes.post('/address', [authMiddleware, adminMiddleware], errorHandler(addAddress));
usersRoutes.delete('/address/:id', [authMiddleware, adminMiddleware], errorHandler(deleteAddress));
usersRoutes.get('/address', [authMiddleware, adminMiddleware], errorHandler(listAddress));

export default usersRoutes;