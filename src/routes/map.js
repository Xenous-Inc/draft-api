import express from 'express';
import authMiddleware from '../middlewares/auth';
import mapController from '../controllers/map';

const mapRouter = express.Router();

mapRouter.get('/get/:title', authMiddleware, mapController.getTitleByCoords);

export default mapRouter;
