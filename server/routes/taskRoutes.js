import express from 'express';
import multer from 'multer';
import { isAdminRoute, protectRoute } from '../middleware/authMiddleware.js';
import { isTaskAssignee } from '../middleware/taskMiddleware.js';
import { 
  createSubTask, 
  createTask, 
  deleteRestoreTask, 
  duplicateTask, 
  getDashboardStatics, 
  getTask, 
  getTasks, 
  postTaskActivity, 
  trashTask, 
  updateTask,
  uploadFile 
} from '../controllers/taskController.js';

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname.split('.').slice(0, -1).join('.') + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Admin-only routes
router.post('/create', protectRoute, isAdminRoute, createTask);
router.post('/duplicate/:id', protectRoute, isAdminRoute, duplicateTask);
router.put('/trash/:id', protectRoute, isAdminRoute, trashTask);
router.put('/delete-restore/:id', protectRoute, isAdminRoute, deleteRestoreTask);

// Routes accessible by both admins and assigned users
router.put('/update/:id', protectRoute, isTaskAssignee, updateTask);
router.put('/create-subtask/:id', protectRoute, isTaskAssignee, createSubTask);
router.put('/activity/:id', protectRoute, isTaskAssignee, postTaskActivity);

// General routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/dashboard', protectRoute, getDashboardStatics);
router.get('/', protectRoute, getTasks);
router.get('/:id', protectRoute, getTask);
router.get('/file/:filename', express.static('uploads'));

export default router;
