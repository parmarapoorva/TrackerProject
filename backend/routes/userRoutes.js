const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/role");
const { sendingMail } = require("../utils/MailUtil");
const router = express.Router();
const crypto = require("crypto");

const SECRET_KEY = "ahemdabad"; // 🔒 Replace with a strong secret key
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role, gender } = req.body;

        console.log("Role received:", role);

        // ❌ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists!" });
        }


        // ✅ Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Get Role ID & Name from Role Model
        const roleDoc = await Role.findById(role);  // 🔥 Find role by ID
        if (!roleDoc) {
            return res.status(400).json({ error: "Invalid role selected!" });
        }

        // ✅ Create New User with roleId and roleName
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            roleId: roleDoc._id,
            roleName: roleDoc.name,  // 🔥 Store role name
            gender
        });
        await sendingMail(email, "Welcome to Our Platform!",
            `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQlSAlF5TxdKwvaCM-0c3rb7M-1-4IAKB2lSAqnT6WdonVE2iECYWH4JtHHlj4Lxe9_pEQ_mGYYKp1kVohgH6udIUoQAKyYMFZgtttyLFA" alt="Project Tracker Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
            
            <h2>Hello ${name}, Welcome to Our Platform!</h2>
            
            <p>Thank you for joining us. Here are your details:</p>
            <ul style="list-style: none; padding: 0;">
                <li><b>Name:</b> ${name}</li>
                <li><b>Email:</b> ${email}</li>
                <li><b>Role:</b> ${roleDoc.name}</li>
            </ul>

            <p>We are excited to have you onboard!</p>

            <br>
            <b>Best Regards,</b> <br>
            <b>Project Tracker</b>
        </div>`
        )

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});






// ✅ LOGIN Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🔍 Step 1: Check if user exists
        const user = await User.findOne({ email }).populate("roleId");
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password!" });
        }

        // 🔍 Step 2: Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password!" });
        }

        // 🔍 Step 3: Check if roleId is populated
        if (!user.roleId || !user.roleId.name) {
            return res.status(500).json({ error: "User role is not assigned correctly!" });
        }

        // 🔍 Step 4: Generate JWT Token with user name
        const token = jwt.sign(
            {
                userId: user._id,
                name: user.name,  // ✅ Include user name in token
                role: user.roleId.name  // ✅ Include user role in token
            },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // 🔍 Step 5: Send Response
        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,  // ✅ Send user name in response
                email: user.email,
                role: user.roleId.name, // ✅ Send user role in response
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/get-user", async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: "User name is required" });
        }

        const user = await User.findOne({ name }).populate("roleId");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.roleId.name,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// 🛠️ Forgot Password Route - Send Reset Link
router.post("/forgot-password", async (req, res) => {
    try {
      // Get email from the request body instead of query parameters
      const email = req.body.email.trim().toLowerCase();
      const foundUser = await User.findOne({ email });
    
      if (foundUser) {
        // Create a token with the user's object (consider only including necessary data)
        const token = jwt.sign(foundUser.toObject(), SECRET_KEY);
        console.log(token);
        
        // Construct the reset password URL with the token
        const url = `http://localhost:5173/resetpassword/${token}`;
        const mailContent = `<html>
                                <a href="${url}">Reset Password</a>
                             </html>`;
        
        // Send the reset link via email using the imported sendingMail function
        await sendingMail(foundUser.email, "Reset Password", mailContent);
        
        res.json({ message: "Reset password link sent to mail." });
      } else {
        res.json({ message: "User not found. Please register first." });
      }
    } catch (error) {
      console.error("Error in forgot password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  


  router.post("/reset-password/:token", async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Decoded:", decoded);

        const user = await User.findById(decoded._id); // ✅ FIXED!
        console.log("Found user:", user);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error.message);
        res.status(400).json({ error: "Invalid or expired token" });
    }
});



router.delete("/delete/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

router.get("/managers", async (req, res) => {
    try {
        const managers = await User.find({ roleName: "Manager" })  // ✅ Use roleName
            .select("name email phone _id roleId");                // ✅ Include roleId
        res.status(200).json(managers);
    } catch (error) {
        console.error("Error fetching managers:", error);
        res.status(500).json({ message: "Failed to fetch managers" });
    }
});


router.get("/developer", async (req, res) => {
    try {
        const developer = await User.find({ roleName: "Developer" })  // ✅ Use roleName
            .select("name email phone _id roleId");                // ✅ Include roleId
        res.status(200).json(developer);
    } catch (error) {
        console.error("Error fetching managers:", error);
        res.status(500).json({ message: "Failed to fetch managers" });
    }
});

module.exports = router