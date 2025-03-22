const Project = require("../models/addproject");
const multer = require("multer");
const path = require("path");
const cloudinaryUtil = require("../utils/Cloudanaryutil");

// ✅ Storage engine
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// ✅ Multer object for file upload
const upload = multer({
  storage: storage,
}).single("file");

// ✅ Add Project without File Upload
const addProject = async (req, res) => {
  try {
    const savedProject = await Project.create(req.body);
    res.status(201).json({
      message: "Project added successfully",
      data: savedProject,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("manager");
    if (projects.length === 0) {
      res.status(404).json({ message: "No projects found" });
    } else {
      res.status(200).json({
        message: "Projects fetched successfully",
        data: projects,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add Project with File Upload
const addProjectWithFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      try {
        // ✅ Upload file to Cloudinary
        const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
        
        // ✅ Store Cloudinary URL in request body
        req.body.fileURL = cloudinaryResponse.secure_url;

        // ✅ Save project to database
        const savedProject = await Project.create(req.body);

        res.status(200).json({
          message: "Project added successfully",
          data: savedProject,
        });
      } catch (uploadError) {
        res.status(500).json({ message: uploadError.message });
      }
    }
  });
};

// ✅ Exporting the functions
module.exports = { addProject, getAllProjects, addProjectWithFile };
