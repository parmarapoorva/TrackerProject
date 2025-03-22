const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const statusSchema = new mongoose.Schema({
  statusId: { 
    type: Number, 
    unique: true 
  },
  statusName: { 
    type: String, 
    required: true, 
    unique: true 
  }
}, { timestamps: true });

// Auto-increment the statusId field
statusSchema.plugin(AutoIncrement, { inc_field: "statusId" });

const Status = mongoose.model("Status", statusSchema);
module.exports = Status;
