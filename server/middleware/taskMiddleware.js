import Task from '../models/task.js';

export const isTaskAssignee = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ status: false, message: "Task not found" });
        }

        // Allow access if user is admin or is assigned to the task
        if (req.user.isAdmin || task.team.includes(userId)) {
            next();
        } else {
            return res.status(403).json({ status: false, message: "Access denied. You are not assigned to this task." });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};
