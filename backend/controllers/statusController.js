const Status = require("../models/Status");

// ✅ Create a new status
exports.createStatus = async (req, res) => {
    try {
      let { statusName } = req.body;
      statusName = statusName.toLowerCase();  // Convert to lowercase
  
      const existingStatus = await Status.findOne({ statusName });
  
      if (existingStatus) {
        return res.status(400).json({ message: "Status already exists" });
      }
  
      const newStatus = new Status({ statusName });
      await newStatus.save();
  
      res.status(201).json({ message: "Status created successfully", status: newStatus });
  
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  

// ✅ Get all statuses
exports.getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.find().sort({ statusId: 1 });
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve statuses", error });
  }
};

// ✅ Get status by ID
exports.getStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await Status.findById(id);

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch status", error });
  }
};

// ✅ Update a status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusName } = req.body;

    const existingStatus = await Status.findById(id);
    if (!existingStatus) {
      return res.status(404).json({ message: "Status not found" });
    }

    existingStatus.statusName = statusName;
    await existingStatus.save();

    res.status(200).json({ message: "Status updated successfully", status: existingStatus });

  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }
};

// ✅ Delete a status
exports.deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStatus = await Status.findByIdAndDelete(id);

    if (!deletedStatus) {
      return res.status(404).json({ message: "Status not found" });
    }

    res.status(200).json({ message: "Status deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete status", error });
  }
};
