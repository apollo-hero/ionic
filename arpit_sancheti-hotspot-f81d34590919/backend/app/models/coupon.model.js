// jshint esversion: 6
const mongoose = require('mongoose');
var moment = require('moment-timezone');
var env = require('../../config/env.config');

const CouponSchema = mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true
  },
  isAbs: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    enum: ['Wallet', 'Transactional'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  minAmount: {
    type: Number,
    required: true,
  },
  maxAmount: {
    type: Number,
    required: true,
  },
  validity: {
    type: mongoose.Schema.Types.Date,
    required: true,
    get: v => moment(v).tz(env.timeZone),
    set: v => moment(v).tz(env.timeZone).toDate()
  },
  validityStart: {
    type: mongoose.Schema.Types.Date,
    required: true,
    get: v => moment(v).tz(env.timeZone),
    set: v => moment(v).tz(env.timeZone).toDate()
  }
}, {
  timestamps: true
});

CouponSchema.pre('save', function (next) {
  if (!this.validityStart) this.validityStart = new Date();
  if (this.validityStart > this.validity) throw new Error('Invalid Validity');
  if (this.value <= 0) throw new Error('Discount should be greater than 0');
  if (!this.Abs && this.value > 0 && this.value <= 100) next();
  else throw new Error('Discount cannot be greater than 100%');
});

module.exports = mongoose.model('Coupon', CouponSchema);
