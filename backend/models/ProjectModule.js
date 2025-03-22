const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const projectModuleSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project", 
    required: true 
  }, 
  moduleId: { 
    type: Number 
  }, 
  moduleName: { 
    type: String, 
    required: true 
  }, 
  description: { 
    type: String 
  }, 
  estimatedHours: { 
    type: Number 
  }, 
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed", "On Hold"],
    default: "Not Started",
  },
  startDate: { 
    type: Date 
  }
}, { timestamps: true });

// Apply auto-increment to moduleId
projectModuleSchema.plugin(AutoIncrement, { inc_field: "moduleId" });

const ProjectModule = mongoose.model("ProjectModule", projectModuleSchema);
module.exports = ProjectModule;
