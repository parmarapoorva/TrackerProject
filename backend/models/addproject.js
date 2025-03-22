const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const projectSchema = new mongoose.Schema({
    projectId: { 
        type: String, 
        default: uuidv4, 
        unique: true 
    },
    pname: { type: String, required: true },
    description: { type: String, required: true },
    technology: { type: String, required: true },
    estimatedHours: { type: Number, required: true },
    startDate: { type: Date, required: true },
    completionDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Working", "Complete"], required: true },
    manager: {  
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        email: String,
        phone: String
    },
    file: {
        data: Buffer,
        contentType: String,
    }
});

module.exports = mongoose.model("Project", projectSchema);
