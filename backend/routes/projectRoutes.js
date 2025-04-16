const User = require("../models/User");
const express = require("express");
const multer = require("multer");
const path = require("path");
const ProjectTeam = require("../models/ProjectTeam");
const authenticate = require("../middleware/authenticate");
const Project = require("../models/addproject"); 
const cloudinaryUtil = require("../utils/Cloudanaryutil");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ File Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");  // Make sure the 'uploads' folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });


// ✅ Add Project Route
router.post("/add-project", upload.single("file"), async (req, res) => {
    try {
      const {
        pname,
        description,
        technology,
        estimatedHours,
        startDate,
        completionDate,
        status,
        managerId
      } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ message: "File upload is required" });
      }
  
      if (!mongoose.Types.ObjectId.isValid(managerId)) {
        return res.status(400).json({ message: "Invalid manager ID format" });
      }
  
      const manager = await User.findById(managerId);
      if (!manager) {
        return res.status(404).json({ message: "Manager not found" });
      }
  
      const newProject = new Project({
        pname,
        description,
        technology,
        estimatedHours,
        startDate,
        completionDate,
        status,
        manager: {
          id: manager._id, // ✅ Save under manager.id
          name: manager.name,
          email: manager.email,
          phone: manager.phone
        },
        file: {
          data: req.file.buffer,         // ✅ Store file in buffer
          contentType: req.file.mimetype
        }
      });
  
      await newProject.save();
      res.status(201).json({
        message: "✅ Project added successfully!",
        project: newProject
      });
  
    } catch (error) {
      console.error("❌ Error adding project:", error);
      res.status(500).json({ message: "Failed to add project", error: error.message });
    }
  });
  


// ✅ Get All Projects Route
router.get("/all-projects", async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("manager", "name email phone")  // ✅ Correctly populate manager
            .exec();

        res.status(200).json(projects);
    } catch (error) {
        console.error("❌ Failed to fetch projects:", error);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
});


// ✅ Delete Project Route
router.delete("/delete-project/:id", async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Remove the file from disk
        const fs = require("fs");
        if (project.file && project.file.path) {
            fs.unlinkSync(project.file.path);  // ✅ Delete file from disk
        }

        res.status(200).json({ message: "✅ Project deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting project:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ Get Assigned Projects Route
router.get("/assigned-projects", authenticate, async (req, res) => {
    try {
        const managerId = req.user.id;  // Extract manager ID from token

        // ✅ Fetch all assigned teams for the manager
        const assignedTeams = await ProjectTeam.find({ userId: managerId });

        // Extract project IDs from the assigned teams
        const projectIds = assignedTeams.map(team => team.projectId);

        // ✅ Fetch project details using correct field (_id)
        const projects = await Project.find({ _id: { $in: projectIds } });

        res.status(200).json({ projects });
    } catch (error) {
        console.error("❌ Error fetching assigned projects:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/manager-projects/:managerId", async (req, res) => {
    const { managerId } = req.params;

    // Validation check
    if (!mongoose.Types.ObjectId.isValid(managerId)) {
        return res.status(400).json({ message: "Invalid manager ID format." });
    }

    try {
        const projects = await Project.find({
            "manager.id": new mongoose.Types.ObjectId(managerId),
        });

        if (!projects.length) {
            return res.status(404).json({ message: "No assigned projects found." });
        }

        res.json(projects);
    } catch (err) {
        console.error("❌ Error fetching projects:", err);
        res.status(500).json({ message: "Server error." });
    }
});

// ✅ Get All Projects Assigned to a Developer (based on ProjectTeam.members)
router.get("/developer/:developerId", async (req, res) => {
  const { developerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(developerId)) {
      return res.status(400).json({ message: "Invalid developer ID format" });
  }

  try {
      // Step 1: Find project teams where developer is in members[]
      const assignedTeams = await ProjectTeam.find({ members: developerId });

      if (!assignedTeams.length) {
          return res.status(404).json({ message: "No projects assigned to this developer" });
      }

      // Step 2: Extract projectIds from teams
      const projectIds = assignedTeams.map(team => team.projectId);

      // Step 3: Fetch project details
      const projects = await Project.find({ _id: { $in: projectIds } });

      res.status(200).json(projects);
  } catch (error) {
      console.error("❌ Error fetching developer's assigned projects:", error);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
