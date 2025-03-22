const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, gender } = req.body;
        if (!role || !gender) return res.status(400).json({ error: "Role and gender are required" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role, gender });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: "Error registering user" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};
