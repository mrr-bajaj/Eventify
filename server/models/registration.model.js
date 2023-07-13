const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  employees: [
    {
      email: {type: String, required: true }
    }]
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
