const ProjectTeam = require("../models/ProjectTeam");
const Project = require("../models/addproject");
const User = require("../models/User");

// ✅ Get all project team members
exports.getProjectTeam = async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log(`📢 Fetching team for projectId: ${projectId}`);

        const projectTeam = await ProjectTeam.findOne({ projectId }).populate("members", "name email");

        if (!projectTeam) {
            return res.status(404).json({ success: false, message: "No team found!" });
        }

        res.json(projectTeam.members);
    } catch (error) {
        console.error("❌ Error fetching team members:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Add a user to a project team
exports.addProjectTeamMember = async (req, res) => {
    try {
        const { projectId, email } = req.body;

        console.log("🔹 Received request to add member:", { projectId, email });

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find project team, or create one if it doesn't exist
        let projectTeam = await ProjectTeam.findOne({ projectId });

        if (!projectTeam) {
            console.warn("⚠️ Project team not found, creating a new one...");
            projectTeam = new ProjectTeam({ projectId, members: [], project_team_id: projectId });
        }

        // Ensure `members` array exists and check if the user is already part of the team
        if (projectTeam.members.includes(user._id)) {
            return res.status(400).json({ error: "User is already in the team" });
        }

        // Add user to the team
        projectTeam.members.push(user._id);
        await projectTeam.save();

        console.log("✅ Developer added successfully:", user._id);
        res.status(201).json({
            message: "Member added!",
            member: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("❌ Error adding project team member:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Remove a user from a project team
exports.removeProjectTeamMember = async (req, res) => {
    try {
        const { projectId, userId } = req.params;

        // Find the project team
        const projectTeam = await ProjectTeam.findOne({ projectId });

        if (!projectTeam) {
            return res.status(404).json({ error: "Project team not found" });
        }

        // Remove the user from members array
        projectTeam.members = projectTeam.members.filter(member => member.toString() !== userId);
        await projectTeam.save();

        res.json({ message: "Project team member removed successfully" });
    } catch (error) {
        console.error("❌ Error removing project team member:", error);
        res.status(500).json({ error: "Error removing project team member" });
    }
};
