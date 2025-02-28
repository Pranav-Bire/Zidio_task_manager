const { createNotification } = require('../controllers/notificationController.js');

const sendNotification = async (req, recipientId, data) => {
    try {
        const notification = await createNotification({
            recipient: recipientId,
            ...data
        });

        // Get io instance
        const io = req.app.get('io');
        
        // Emit to specific user's room
        io.to(recipientId.toString()).emit('newNotification', notification);

        return notification;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

// Helper functions for common notifications
const sendTaskAssignedNotification = async (req, recipientId, taskId, taskTitle) => {
    return sendNotification(req, recipientId, {
        type: 'task',
        text: `You have been assigned to the task: ${taskTitle}`,
        task: taskId
    });
};

const sendTaskUpdatedNotification = async (req, recipientId, taskId, taskTitle, updateType) => {
    return sendNotification(req, recipientId, {
        type: 'task',
        text: `Task "${taskTitle}" has been ${updateType}`,
        task: taskId
    });
};

const sendMentionNotification = async (req, recipientId, taskId, taskTitle, mentionedBy) => {
    return sendNotification(req, recipientId, {
        type: 'message',
        text: `${mentionedBy} mentioned you in task: ${taskTitle}`,
        task: taskId
    });
};

module.exports = {
    sendNotification,
    sendTaskAssignedNotification,
    sendTaskUpdatedNotification,
    sendMentionNotification
};
