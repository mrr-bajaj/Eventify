const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true,unique:true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  venue: { type: String, required: true },
  location: {type: String, required: true},
  type: { type: String, required: true },
  image: { type: String ,required: true },
  qrCode : { type: String, required: true,unique: true }
});

const event = mongoose.model('Events', eventSchema);

module.exports = event;
