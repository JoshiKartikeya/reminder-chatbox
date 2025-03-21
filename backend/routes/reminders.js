const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder"); // Add this import
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  toggleComplete,
} = require("../controllers/reminders");

// Get all reminders
router.get("/", getReminders);

// Create a new reminder
router.post("/", async (req, res) => {
  console.log("Received reminder request:", req.body);
  try {
    const reminder = await Reminder.create(req.body);
    console.log("Created reminder:", reminder);
    res.status(201).json(reminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(400).json({ error: error.message });
  }
});

// Update a reminder
router.put("/:id", updateReminder);

// Delete a reminder
router.delete("/:id", deleteReminder);

// Toggle reminder completion
router.patch("/:id/toggle", toggleComplete);

module.exports = router;
