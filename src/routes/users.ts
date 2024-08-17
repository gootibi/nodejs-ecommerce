import express, { Router } from 'express';
import { addAddress, deleteAddress, listAddress, updateUser } from '../controllers/users';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';

const usersRoutes: Router = express.Router();

usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress));
usersRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress));
usersRoutes.put('/', [authMiddleware], errorHandler(updateUser));

export default usersRoutes;