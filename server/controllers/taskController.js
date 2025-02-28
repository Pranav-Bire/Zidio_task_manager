import mongoose from 'mongoose';
import Notice from "../models/Notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req, res) => {
    try {
        const { userId } = req.user;
        const { title, team, stage, date, priority, assets, assignee } = req.body;

        // Ensure team includes the creator if not already included
        const taskTeam = Array.isArray(team) ? team : [];
        if (!taskTeam.includes(userId)) {
            taskTeam.push(userId);
        }

        // Create task first
        const task = await Task.create({
            title,
            team: taskTeam, 
            stage: stage?.toLowerCase() || 'todo', 
            date, 
            priority: priority?.toLowerCase() || 'medium', 
            assets, 
            activities: {
                type: "assigned",
                activity: `Task created by ${req.user.email}`,
                by: userId,
            },
        });

        // Create notification text
        let text = `New task "${title}" has been created`;
        if (taskTeam.length > 1) {
            text += ` and assigned to ${taskTeam.length - 1} team members`;
        }
        text += `. Priority: ${priority?.toLowerCase() || 'medium'}`;
        if (date) {
            text += `, Due: ${new Date(date).toLocaleDateString()}`;
        }

        // Create notification for all team members including creator
        await Notice.create({
            team: taskTeam,
            text,
            task: task._id,
            notiType: "alert",
            isRead: [] // Initialize empty isRead array
        });

        res.status(201).json({
            status: true,
            task,
            message: "Task has been created successfully"
        });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(400).json({ status: false, message: error.message })
    }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: 'Task not found' });
    }

    const newTask = await Task.create({
      ...task.toObject(),
      _id: new mongoose.Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();

    return res.status(200).json({
      status: true,
      message: 'Task duplicated successfully',
      task: newTask
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const {userId} = req.user;
        const {type, activity} = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({
                status: false,
                message: "Task not found"
            });
        }

        const data = {
            type,
            activity,
            by: userId,
            date: new Date()
        };
        
        task.activities.push(data);
        await task.save();

        // Get the updated task with populated data
        const updatedTask = await Task.findById(id)
            .populate('activities.by', 'name email')
            .populate('team', 'name email title');

        res.status(200).json({
            status: true,
            message: "Task activity posted successfully",
            task: updatedTask
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getDashboardStatics = async (req, res) => {
    try {
        const {userId, isAdmin} = req.user;

        const allTasks = isAdmin? await Task.find({
            isTrashed: false,
        }).populate({
            path: "team",
            select: "name role title email",
        }).sort ({_id: -1})
        :await Task.find({
            isTrashed: false,
            team:{$all: [userId]},
        }).populate({
            path: "team",
            select: "name role title email",
        }).sort ({_id: -1})

        const users = await User.find({
            isActive : true,
        }).select("name title role isAdmin createdAt")
        .limit(10)
        .sort({_id: -1});


        // group task by stage amd calculate count 
        const groupTasks = allTasks.reduce((result, task) => {
            const stage = task.stage;
            if(!result[stage]){
                result[stage] = 1;
            }else{
                result[stage] += 1;
            }

            return result;
        }, {});

        // group task by priority and calculate count

        const groupData = Object.entries(
            allTasks.reduce((result, task) => {
            const {priority} = task;
            result [priority] = (result [priority] || 0) +1;
            
            return result;

        }, {})).map(([name, total])=> ({name, total}));


        //calculate the total task 

        const totalTasks = allTasks?.length;
        const last10Task = allTasks?.slice(0,10)

        const summary ={
            totalTasks,
            last10Task,
            users: isAdmin ? users:[],
            tasks: groupTasks,
            graphData: groupData,
        };

        res.status(200).json({
            status: true,
            message:"Tasks fetched successfully",
            ...summary,
        })

    

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message })
    }
};



    export const getTasks = async (req, res) => {
        try {
            const { userId, isAdmin } = req.user;
            const {stage, isTrashed} = req.query;
            let query = {isTrashed: isTrashed? true: false};

            if(stage){
                query.stage = stage;
            }

            // If not admin, only show tasks assigned to the user
            if (!isAdmin) {
                query.team = userId;
            }

            let queryResult = Task.find(query)
            .populate({
                path:"team",
                select:"name title email",
            }).sort({_id: -1});

            const tasks = await queryResult;

            res.status(200).json({
                status: true,
                tasks,
            })
            
            }catch(error){
                console.log(error);
                return res.status(400).json({ status: false, message: error.message })
            }
        };


    
    export const getTask = async (req, res) => {
        try {

            const {id} = req.params;
            const task = await Task.findById(id)
            .populate({
                path:"team",
                select:"name title role email",
            }).populate({
                path:"activities.by",
                select:"name",
            }).sort({_id: -1});


            res.status(200).json({
                status: true,
                task,
            })

            }catch(error){
                console.log(error);
                return res.status(400).json({ status: false, message: error.message })
            }
        };



    export const createSubTask = async (req, res) => {
        try {
            const {title, tag, data} = req.body;
            const {id} = req.params;

            const newSubTask ={
                title,
                tag,
                data,
            };

            const task = await Task.findById(id);
            task.subTasks.push(newSubTask);
            await task.save();

            res.status(200).json({
                status: true,
                message:"Subtask added successfully"
            });

            

            }catch(error){
                console.log(error);
                return res.status(400).json({ status: false, message: error.message })
            }
        };


    
    export const updateTask = async (req, res) => {
            try {

                const {id} = req.params;
                const {title, date, team, stage, priority, assets} = req.body;
                 const task = await Task.findById(id);

                 task.title = title;
                 task.date = date;
                 task.team = team;
                 task.stage = stage.toLowerCase();
                 task.priority = priority.toLowerCase();
                 task.assets = assets;

                 await task.save();

                 res.status(200).json({
                     status: true,
                     message:"Task updated successfully"
                 });
                
                }catch(error){
                    console.log(error);
                    return res.status(400).json({ status: false, message: error.message })
                }
            };

    export const trashTask = async (req, res) => {
            try {

                const {id} = req.params;

                const task = await Task.findById(id);
                task.isTrashed = true;
                await task.save();

                res.status(200).json({
                    status: true,
                    message:"Task trashed successfully"
                })
                
                }catch(error){
                    console.log(error);
                    return res.status(400).json({ status: false, message: error.message })
                }
            };



        
    export const deleteRestoreTask = async (req, res) => {
            try {
                const {id} = req.params;
                const {actionType} = req.body;

                let result;

                switch (actionType) {
                    case 'delete':
                        result = await Task.findByIdAndDelete(id);
                        break;
                    case 'deleteAll':
                        result = await Task.deleteMany({isTrashed: true});
                        break;
                    case 'restore':
                        result = await Task.findByIdAndUpdate(
                            id,
                            {isTrashed: false},
                            {new: true}
                        );
                        break;
                    case 'restoreAll':
                        result = await Task.updateMany(
                            {isTrashed: true},
                            {isTrashed: false}
                        );
                        break;
                    default:
                        throw new Error('Invalid action type');
                }

                if (!result) {
                    return res.status(404).json({
                        status: false,
                        message: 'Task not found'
                    });
                }

                return res.status(200).json({
                    status: true,
                    message: `Task ${actionType} successful`,
                    result
                });
            } catch (error) {
                console.error(error);
                return res.status(400).json({ 
                    status: false, 
                    message: error.message 
                });
            }
        };



        
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'No file uploaded' });
    }
    
    // Return just the filename
    return res.status(200).json({
      status: true,
      message: 'File uploaded successfully',
      filename: req.file.filename
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = `../uploads/${filename}`;
    return res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};