const express = require("express");
const router = express.Router();
const moduleController = require("../controllers/projectModulecontroller");
const Project = require("../models/addproject");
const mongoose = require("mongoose");

const authenticate = require("../middleware/authenticate");

// ✅ Get all modules for a project
router.get("/project-modules/:projectId", moduleController.getProjectModules);

// ✅ Add a module
router.post("/project-modules", moduleController.addProjectModule);

// ✅ Remove a module
router.delete("/project-modules/:projectId/:moduleId", moduleController.removeProjectModule);

// ✅ Get all projects assigned to a specific manager
router.get("/manager-projects/:managerId", async (req, res) => {
    const { managerId } = req.params;
  
    try {
      const projects = await Project.find({
        "manager.id": new mongoose.Types.ObjectId(managerId)
      });
  
      if (!projects.length) {
        return res.status(404).json({ message: "No assigned projects found" });
      }
  
      projects.forEach((project) => {
        console.log("✅ Project found:", project.pname);
      });
  
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
