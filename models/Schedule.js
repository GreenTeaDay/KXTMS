// models/Schedule.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  quoteId: {
    type: Schema.Types.ObjectId,
    ref: 'Quote',
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  specialInstructions: {
    type: String
  },
  assignedDriver: {
    type: String
  },
  // Add any other fields as needed
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
