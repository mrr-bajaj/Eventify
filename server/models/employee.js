const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empEmail: { type: String, required: true, unique: true },
  empPassword: { type: String, required: true },
  empName: { type: String, required: true },
  role: {type: String}
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
