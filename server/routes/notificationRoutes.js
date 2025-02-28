import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from '../controllers/notificationController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/')
    .get(getNotifications);

router.route('/:id/read')
    .put(markAsRead);

router.route('/read-all')
    .put(markAllAsRead);

export default router;
