import express from 'express';
import authMiddleware from '../middlewares/auth';
import userController from '../controllers/user';

const userRouter = express.Router();

userRouter.get('/:phone', authMiddleware, userController.getUserInfo);

userRouter.post('/change/username', authMiddleware, userController.changeUsername);

export default userRouter;
