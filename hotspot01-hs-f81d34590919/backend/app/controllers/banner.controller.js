// jshint esversion:6
const Banner = require('../models/banner.model');
const fs = require('fs');

// Create and Save a new banner
exports.create = (req, res) => {
  let active = true;
  let imageSplit = req.body.image.split(",");
  let image = new Buffer(imageSplit[1], 'base64');
  let contentType = imageSplit[0];
  const banner = new Banner({
    image,
    contentType,
    active,
    url: req.body.url
  });
  banner.save()
    .then(data => {
      res.send({
        success: true,
        data: data
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the banner."
      });
    });
};

exports.findAll = (req, res) => {
  Banner.find({
      active: true
    }).select('_id')
    .then(banners => {
      res.send({
        success: true,
        data: banners
      });

    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving banners."
      });
    });
};

exports.findOne = (req, res) => {
  let fileName = req.params.bannerId;
  bannerId = fileName.split('.')[0];
  Banner.findById(bannerId).then(doc => {
    doc.contentType = 'image/png';
    res.contentType(doc.contentType);
    res.send(doc.image);
  }).catch(err => {
    console.error(err);
  });
}

exports.update = (req, res) => {
  const bannerId = req.params.bannerId;
  const bannerData = req.body;
  Banner.findByIdAndUpdate(bannerId, bannerData, {
    new: true
  }).then(banner => {
    if (!banner) {
      return res.status(404).send({
        message: "banner not found with id " + req.params.bannerId
      });
    }
    res.send({
      success: true,
      data: banner
    });
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "banner not found with id " + req.params.bannerId
      });
    }
    return res.status(500).send({
      message: "Error updating banner with id " + req.params.bannerId
    });
  });
}
