const ProjectModule = require("../models/ProjectModule");
const Project = require("../models/addproject");

// ✅ Get all modules for a project
exports.getProjectModules = async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log(`📢 Fetching modules for projectId: ${projectId}`);

        const modules = await ProjectModule.find({ projectId });

        if (!modules || modules.length === 0) {
            return res.status(404).json({ success: false, message: "No modules found!" });
        }

        res.status(200).json({ success: true, modules });
    } catch (error) {
        console.error("❌ Error fetching modules:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Add a new module to a project
exports.addProjectModule = async (req, res) => {
    try {
        const { projectId, moduleName, description, estimatedHours, status, startDate } = req.body;

        console.log("🔹 Received request to add module:", { projectId, moduleName });

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Create and save the new module
        const newModule = new ProjectModule({
            projectId,
            moduleName,
            description,
            estimatedHours,
            status: status || "Not Started",
            startDate
        });

        await newModule.save();

        console.log("✅ Module added successfully:", newModule._id);
        res.status(201).json({
            message: "Module added!",
            module: newModule
        });

    } catch (error) {
        console.error("❌ Error adding module:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Remove a module from a project
exports.removeProjectModule = async (req, res) => {
    try {
        const { projectId, moduleId } = req.params;

        // Check if the module exists
        const module = await ProjectModule.findOne({ projectId, _id: moduleId });

        if (!module) {
            return res.status(404).json({ error: "Module not found" });
        }

        // Remove the module
        await ProjectModule.deleteOne({ _id: moduleId });

        res.json({ message: "Module removed successfully" });

    } catch (error) {
        console.error("❌ Error removing module:", error);
        res.status(500).json({ error: "Error removing module" });
    }
};
