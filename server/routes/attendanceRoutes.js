const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

// ==========================================================
// GET attendance
// ==========================================================

router.get("/", async (req, res) => {
  try {
    const { date } = req.query;

    let attendance;

    if (date) {
      attendance = await Attendance.find({
        date,
      }).sort({ employeeId: 1 });
    } else {
      attendance = await Attendance.find().sort({
        date: -1,
        employeeId: 1,
      });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
});

// ==========================================================
// MARK / UPDATE ATTENDANCE
// ==========================================================

router.post("/", async (req, res) => {
  try {
    const {
      date,
      employeeId,
      status,
    } = req.body;

    const attendance =
      await Attendance.findOneAndUpdate(
        {
          date,
          employeeId,
        },
        {
          date,
          employeeId,
          status,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({
      message: "Failed to save attendance",
      error: error.message,
    });
  }
});

// ==========================================================
// DELETE attendance
// ==========================================================

router.delete("/:date/:employeeId", async (req, res) => {
  try {
    const { date, employeeId } = req.params;

    const attendance =
      await Attendance.findOneAndDelete({
        date,
        employeeId,
      });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.json({
      message: "Attendance deleted successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete attendance",
      error: error.message,
    });
  }
});

module.exports = router;