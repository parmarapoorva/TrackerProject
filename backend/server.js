const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("dotenv").config(); // Load environment variables
require("./config/passport"); // Import Passport Config

// Initialize App
const app = express();

// ✅ Middleware
app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.JWT_SECRET || "default-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/project-team", require("./routes/ProjectTeamRouter"));

const ProjectModule = require("./routes/projectModule")
app.use("/api/module",ProjectModule)
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);
const statusRoutes = require("./routes/statusRoutes")
app.use("/api/statuses", statusRoutes);
// ✅ Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Database connected!"))
.catch(err => console.error("❌ Database connection error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
