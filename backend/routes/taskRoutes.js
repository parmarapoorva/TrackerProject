const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskcontroller");
const Task = require("../models/Task"); // ✅ Import Task model

// Task Routes
router.post("/", taskController.createTask);           // Create Task
router.get("/", taskController.getAllTasks);           // Get All Tasks
router.get("/:id", taskController.getTaskById);        // Get Task by ID
router.put("/:id", taskController.updateTask);         // Update Task
router.delete("/:id", taskController.deleteTask);      // Delete Task

// ✅ Get tasks by Project ID
router.get("/project/:projectId", async (req, res) => {
    const { projectId } = req.params;

    try {
        const tasks = await Task.find({ projectId });
        res.status(200).json(tasks);
    } catch (err) {
        console.error("❌ Error fetching tasks by project ID:", err);
        res.status(500).json({ message: "Failed to fetch tasks." });
    }
});

module.exports = router;
