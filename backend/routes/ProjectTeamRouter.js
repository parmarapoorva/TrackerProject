const express = require("express");
const router = express.Router();
const { addProjectTeamMember, getProjectTeam, removeProjectTeamMember } = require("../controllers/ProjecTeamController");


router.post("/add-member", addProjectTeamMember); // ✅ Correct Route
router.get("/all-members/:projectId", getProjectTeam); // ✅ Get all team members
router.delete("/remove-member/:projectId/:userId", removeProjectTeamMember);

module.exports = router;
