const mongoose = require("mongoose");

const ProjectTeamSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // ✅ Reference the User model
        },
    ],
    project_team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", // Or use a custom field to ensure uniqueness
        unique: true,    // If this field is meant to be unique
    },
});

module.exports = mongoose.model("ProjectTeam", ProjectTeamSchema);
