// models/Quote.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  originPostalCode: {
    type: Number,
    required: true
  },
  destPostalCode: {
    type: Number,
    required: true
  },
  estimatedCost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },

  // Add any other fields as needed
}, { timestamps: true });

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
