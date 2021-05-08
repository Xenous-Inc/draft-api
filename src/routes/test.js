import express from 'express';
import authMiddleware from '../middlewares/auth';

const testController = express.Router();

testController.post('/create', authMiddleware);

export default testController;
