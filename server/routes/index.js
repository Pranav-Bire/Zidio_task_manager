import express from 'express';
import userRoutes from './userRoutes.js';
import taskRoutes from './taskRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/task', taskRoutes);
router.use('/notifications', notificationRoutes);

export default router;