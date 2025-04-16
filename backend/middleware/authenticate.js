const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// ✅ Improved Authentication Middleware
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("🟡 Incoming Authorization Header:", authHeader); // ✅ Add this

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("⛔ No token or bad format");
            return res.status(401).json({ message: "No token provided or invalid format" });
        }

        const token = authHeader.split(' ')[1];
        console.log("🔑 Extracted Token:", token); // ✅ Add this

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("🔴 Authentication error:", err.message);
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Token expired" });
                }
                return res.status(403).json({ message: "Invalid token" });
            }

            console.log("✅ Token Verified. Decoded:", decoded); // ✅ Add this
            req.user = decoded;
            next();
        });

    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "Server error during authentication" });
    }
};

module.exports = authenticate;
