const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskId: { type: Number, required: true, unique: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectModule", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    description: { type: String, required: true },
    statusId: { type: mongoose.Schema.Types.ObjectId, ref: "Status", required: true },
    totalMinutes: { type: Number, default: 0 }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
