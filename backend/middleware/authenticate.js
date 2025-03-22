const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// ✅ Improved Authentication Middleware
const authenticate = (req, res, next) => {
    try {
        // 🔥 Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided or invalid format" });
        }

        const token = authHeader.split(' ')[1];

        // ✅ Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("🔴 Authentication error:", err.message);

                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Token expired" });
                }

                return res.status(403).json({ message: "Invalid token" });
            }

            req.user = decoded;  // Attach decoded user info to request
            next();
        });

    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "Server error during authentication" });
    }
};

module.exports = authenticate;
