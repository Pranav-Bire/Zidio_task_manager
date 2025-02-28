import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{type: String, required: true},
    date:{type: Date, default: new Date()},
    priority:{type: String, required: true, default: 'normal', enum: ['low', 'normal', 'medium', 'high']},

    stage:{type: String, 
        required: true, 
        default: 'todo', 
        enum: ['todo', 'in progress', 'completed']},

    activities:[{
        type:{
            type: String,
            default: 'assigned',
            enum: [ 'assigned', 'started', 'in progress', 'bug', 'commented', 'completed'],
                       
        },
        activity: String,
        date: {type: Date, default: new Date()},
        by: {type:Schema.Types.ObjectId, ref: 'User'},
        
    }],


    subTasks:[{
        title:{type: String},
        date:{type: Date, default: new Date()},
        tag:{type: String},
    },
],

assets:[String],
team:[{type: Schema.Types.ObjectId, ref: 'User'}],
isTrashed:{type: Boolean, default: false},

},{
    timestamps: true
}
);

const Task = mongoose.model('Task', taskSchema);

export default Task;