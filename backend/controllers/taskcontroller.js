const Task = require("../models/Task");
const ProjectModule = require("../models/ProjectModule");
const Project = require("../models/addproject");
const Status = require("../models/Status");
const mongoose = require("mongoose");
// ✅ Create a New Task
// const Task = require("../models/Task");

// ✅ Create a New Task with Auto-Incrementing taskId


exports.createTask = async (req, res) => {
    try {
        const { moduleId, projectId, statusId, title, priority, description, totalMinutes } = req.body;

        // ✅ Validate and convert IDs to ObjectId
        const moduleObjectId = mongoose.Types.ObjectId.isValid(moduleId) ? new mongoose.Types.ObjectId(moduleId) : null;
        const projectObjectId = mongoose.Types.ObjectId.isValid(projectId) ? new mongoose.Types.ObjectId(projectId) : null;
        const statusObjectId = mongoose.Types.ObjectId.isValid(statusId) ? new mongoose.Types.ObjectId(statusId) : null;

        if (!moduleObjectId || !projectObjectId || !statusObjectId) {
            return res.status(400).json({ message: "Invalid module, project, or status ID" });
        }

        // ✅ Find the latest taskId and increment it
        const lastTask = await Task.findOne().sort({ taskId: -1 });
        const nextTaskId = lastTask ? lastTask.taskId + 1 : 1;

        // ✅ Create the new task
        const newTask = new Task({
            taskId: nextTaskId,
            moduleId: moduleObjectId,
            projectId: projectObjectId,
            statusId: statusObjectId,
            title,
            priority,
            description,
            totalMinutes
        });

        await newTask.save();

        // ✅ Populate module, project, and status details
        const populatedTask = await Task.findById(newTask._id)
            .populate({ path: "moduleId", select: "moduleName" })      // ✅ Populate moduleName
            .populate({ path: "projectId", select: "pname" })    // ✅ Populate projectName
            .populate({ path: "statusId", select: "statusName" });     // ✅ Populate statusName

        res.status(201).json({
            message: "Task created successfully",
            task: populatedTask
        });

    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: error.message });
    }
};



// ✅ Get All Tasks with Pagination and Proper Population
// ✅ Get All Tasks with Proper Population
// ✅ Get All Tasks with Proper Population

exports.getAllTasks = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
  
      const tasks = await Task.find()
        .populate({
          path: "projectId",           // ✅ Populate project details
          select: "pname"        // ✅ Only include projectName
        })
        .populate({
          path: "moduleId",
          select: "moduleName"
        })
        .populate({
          path: "statusId",
          select: "statusName"
        })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .exec();
  
      const totalTasks = await Task.countDocuments();
  
      res.status(200).json({
        tasks,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks
      });
  
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: error.message });
    }
  };



// ✅ Get Task by ID with Detailed Population
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("moduleId", "moduleName")
            .populate("projectId", "projectName")
            .populate("statusId", "statusName");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);

    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update Task with Validation
exports.updateTask = async (req, res) => {
    try {
        const { moduleId, projectId, statusId } = req.body;

        // ✅ Validation: Ensure module, project, and status exist
        const validationChecks = [];
        
        if (moduleId) validationChecks.push(ProjectModule.findById(moduleId));
        if (projectId) validationChecks.push(Project.findById(projectId));
        if (statusId) validationChecks.push(Status.findById(statusId));

        const results = await Promise.all(validationChecks);

        if (moduleId && !results[0]) return res.status(404).json({ message: "Module not found" });
        if (projectId && !results[1]) return res.status(404).json({ message: "Project not found" });
        if (statusId && !results[2]) return res.status(404).json({ message: "Status not found" });

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate("moduleId", "moduleName")
            .populate("projectId", "projectName")
            .populate("statusId", "statusName");

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", task: updatedTask });

    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete Task with Validation
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: error.message });
    }
};
