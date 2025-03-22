const router = require("express").Router();
const passport = require("passport");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	})
);

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});



router.get("/admin-details", async (req, res) => {
    try {
        const adminRole = await Role.findOne({ name: "Admin" }); // ✅ Get Admin Role ID
        if (!adminRole) return res.status(404).json({ message: "Admin role not found" });

        const admin = await User.findOne({ roleId: adminRole._id }); // ✅ Fetch Admin User
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        res.json(admin);
    } catch (error) {
        console.error("Error fetching admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
