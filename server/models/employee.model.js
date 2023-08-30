const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  roles: { type: [String], default: 'user' },
  gender: { type: String, required: true },
  profileImagePath: { type: String }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
