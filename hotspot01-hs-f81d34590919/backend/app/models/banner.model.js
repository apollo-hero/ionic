// jshint esversion: 6
const mongoose = require('mongoose');

const BannerSchema = mongoose.Schema({
  url: {
    type: String
  },
  image: {
    type: mongoose.Schema.Types.Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Banner', BannerSchema);
