const express = require("express");
const router = express.Router();
const moduleController = require("../controllers/projectModulecontroller"); 
const Project = require("../models/ProjectModule");

// ✅ Get all modules for a project
router.get("/project-modules/:projectId", moduleController.getProjectModules);

// ✅ Add a module
router.post("/project-modules", moduleController.addProjectModule);

// ✅ Remove a module
router.delete("/project-modules/:projectId/:moduleId", moduleController.removeProjectModule);

router.get("/manager-projects/:managerId", async (req, res) => {
    const { managerId } = req.params;

    try {
        const projects = await project.find({ assignedManagers: managerId });

        if (!projects.length) {
            return res.status(404).json({ message: "No assigned projects found" });
        }

        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;  // ✅ Correct export
