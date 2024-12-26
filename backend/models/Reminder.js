const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  app: {
    type: String,
    default: "default",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reminder", reminderSchema);
