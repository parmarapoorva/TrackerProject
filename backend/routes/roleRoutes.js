const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

// 🔥 Routes for roles
router.post("/", roleController.createRole); // Create a new role
router.get("/", roleController.getAllRoles); // Get all roles
router.get("/:id", roleController.getRoleById); // Get a role by ID
router.put("/:id", roleController.updateRole); // Update a role
router.delete("/:id", roleController.deleteRole); // Delete a role

module.exports = router;
