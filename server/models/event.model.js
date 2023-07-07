const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: { type: String, required: true,unique:true },
  eventName: { type: String, required: true },
  eventDescription: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventStartTime: { type: String, required: true },
  eventEndTime: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventType: { type: String, required: true },
  eventImage: { type: String ,required: true },
  eventQrCode : { type: String, required: true,unique: true }
});

const event = mongoose.model('Events', eventSchema);

module.exports = event;
