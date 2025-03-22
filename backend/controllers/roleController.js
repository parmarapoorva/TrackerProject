const Role = require("../models/role");

// ✅ Create a new role
exports.createRole = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if role already exists
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ error: "Role already exists" });
        }

        const newRole = new Role({ name });
        await newRole.save();
        res.status(201).json({ message: "Role created successfully", role: newRole });
    } catch (error) {
        res.status(500).json({ error: "Error creating role", details: error.message });
    }
};


// ✅ Get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: "Error fetching roles", details: error.message });
    }
};

// ✅ Get a single role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: "Error fetching role", details: error.message });
    }
};

// ✅ Update a role
exports.updateRole = async (req, res) => {
    try {
        const { name } = req.body;

        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedRole) {
            return res.status(404).json({ error: "Role not found" });
        }

        res.json({ message: "Role updated successfully", role: updatedRole });
    } catch (error) {
        res.status(500).json({ error: "Error updating role", details: error.message });
    }
};

// ✅ Delete a role 
exports.deleteRole = async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) {
            return res.status(404).json({ error: "Role not found" });
        }
        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting role", details: error.message });
    }
};
