const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  employees: [
    {
      email: {type: String, required: true },
      time: {type: String, required: true }
    }]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
