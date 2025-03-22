const express = require("express");
const router = express.Router();
const statusController = require("../controllers/statusController");

// ✅ Create a new status
router.post("/", statusController.createStatus);

// ✅ Get all statuses
router.get("/", statusController.getAllStatuses);

// ✅ Get a status by ID
router.get("/:id", statusController.getStatusById);

// ✅ Update a status by ID
router.put("/:id", statusController.updateStatus);

// ✅ Delete a status by ID
router.delete("/:id", statusController.deleteStatus);

module.exports = router;
