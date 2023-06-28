const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empEmail: { type: String, required: true, unique: true },
  empPassword: { type: String, required: true },
  empName: { type: String, required: true },
  roles: {type: [String],default:'user'}
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
