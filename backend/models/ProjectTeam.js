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
});

module.exports = mongoose.model("ProjectTeam", ProjectTeamSchema);
