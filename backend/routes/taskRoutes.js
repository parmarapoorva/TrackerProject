const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskcontroller");

// Task Routes
router.post("/", taskController.createTask);  // Create Task
router.get("/", taskController.getAllTasks);  // Get All Tasks
router.get("/:id", taskController.getTaskById);  // Get Task by ID
router.put("/:id", taskController.updateTask);  // Update Task
router.delete("/:id", taskController.deleteTask);  // Delete Task

module.exports = router;
