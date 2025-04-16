const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // ✅ Required to validate ObjectId

// Models
const ProjectTeam = require("../models/ProjectTeam");
const Project = require("../models/addproject"); // ✅ Required to fetch projects

// Controllers
const { 
  addProjectTeamMember, 
  getProjectTeam, 
  removeProjectTeamMember 
} = require("../controllers/ProjecTeamController");

// Routes
router.post("/add-member", addProjectTeamMember);
router.get("/all-members/:projectId", getProjectTeam);
router.delete("/remove-member/:projectId/:userId", removeProjectTeamMember);

// ✅ Route to get projects assigned to a developer
router.get("/developer/:developerId", async (req, res) => {
  const { developerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(developerId)) {
    return res.status(400).json({ message: "Invalid developer ID format" });
  }

  try {
    const assignedTeams = await ProjectTeam.find({ members: developerId });

    if (!assignedTeams.length) {
      return res.status(404).json({ message: "No projects assigned to this developer" });
    }

    const projectIds = assignedTeams.map(team => team.projectId);

    const projects = await Project.find({ _id: { $in: projectIds } });

    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Error fetching developer's assigned projects:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
