import express from 'express';
import authMiddleware from '../middlewares/auth';
import testController from '../controllers/test';

const testRouter = express.Router();

testRouter.post('/create', authMiddleware, testController.createTest);

testRouter.get('/get/all', authMiddleware, testController.getAllTests);
testRouter.get('/get/:testId', authMiddleware, testController.getTest);

export default testRouter;
