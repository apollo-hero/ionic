const mongoose = require('mongoose');

const PlanSchema = mongoose.Schema({
  plan_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration_val: {
    type: Number,
    required: true,
    get: v => Math.floor(v),
    set: v => Math.floor(v),
  },
  duration_type: {
    type: Number,
    required: true
  },
  speed_dl: {
    type: Number,
    required: true
  },
  speed_ul: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: [
      'USD',
      'EUR',
      'GBP',
      'BRL',
      'DKK',
      'XCD',
    ]
  },
  bytes_t: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', PlanSchema);
