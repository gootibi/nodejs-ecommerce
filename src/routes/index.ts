import express, { Router } from 'express';
import authRoutes from './auth';

const rootRouter: Router = express.Router();

rootRouter.use('/auth', authRoutes);

export default rootRouter;