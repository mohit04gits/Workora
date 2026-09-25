const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "Half-Day", "On Leave"],
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index(
  { date: 1, employeeId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);