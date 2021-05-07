import express from 'express';
import authMiddleware from '../middlewares/auth';
import userController from '../controllers/user';

const userRouter = express.Router();

userRouter.get('/:login', authMiddleware, userController.getUserInfo);

export default userRouter;
