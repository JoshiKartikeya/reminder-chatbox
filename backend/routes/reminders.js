const express = require("express");
const router = express.Router();
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
router.post("/", createReminder);

// Update a reminder
router.put("/:id", updateReminder);

// Delete a reminder
router.delete("/:id", deleteReminder);

// Toggle reminder completion
router.patch("/:id/toggle", toggleComplete);

module.exports = router;
