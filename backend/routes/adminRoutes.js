const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const User = require("../models/User"); // Ensure correct model path

router.get("/profile", authenticate, async (req, res) => {
    try {
        const admin = await User.findById(req.user._id).select("-password"); // Exclude password

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json(admin);
    } catch (error) {
        console.error("Error fetching admin data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
