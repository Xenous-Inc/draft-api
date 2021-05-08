import express from 'express';
import authController from '../controllers/auth';
import authMiddleware from '../middlewares/auth';

const authRouter = express.Router();

authRouter.post('/', authController.auth);
authRouter.get('/logout', authMiddleware, authController.logout);
authRouter.get('/logoutall', authMiddleware, authController.logoutAll);

export default authRouter;
