const Reminder = require("../models/Reminder");

// Get all reminders
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ createdAt: -1 });
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new reminder
exports.createReminder = async (req, res) => {
  try {
    const reminder = new Reminder({
      task: req.body.task,
      deadline: req.body.deadline,
      app: req.body.app,
    });

    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a reminder
exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle reminder completion
exports.toggleComplete = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    reminder.completed = !reminder.completed;
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
