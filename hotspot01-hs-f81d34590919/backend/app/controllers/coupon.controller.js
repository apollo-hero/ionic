// jshint esversion: 6
const Coupon = require('../models/coupon.model');
const moment = require('moment');

exports.findTransactional = (req, res) => {
  let couponCode = req.params.couponCode;
  Coupon.findOne({
    couponCode,
    type: 'Transactional'
  }).then(coupon => {
    if (!coupon) {
      return res.status(404).send({
        message: "No Coupon Found"
      });
    }
    if (moment(coupon.validity).endOf('day').diff(moment(), 'd') < 0) {
      return res.status(404).send({
        message: "Coupon Expired"
      });
    }
    return res.send({
      success: true,
      data: coupon
    });
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "No Coupon Found"
      });
    }
    return res.status(500).send({
      message: "Error in retreving coupon"
    });
  });
};

exports.findWallet = (req, res) => {
  let couponCode = req.params.couponCode;
  Coupon.findOne({
    couponCode,
    type: 'Wallet'
  }).then(coupon => {
    if (!coupon) {
      return res.status(404).send({
        message: "No Coupon Found"
      });
    }
    if (moment(coupon.validity).endOf('day').diff(moment(), 'd') < 0) {
      return res.status(404).send({
        message: "Coupon Expired"
      });
    }
    return res.send({
      success: true,
      data: coupon
    });
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "No Coupon Found"
      });
    }
    return res.status(500).send({
      message: "Error in retreving coupon"
    });
  });
};

exports.addCoupon = (req, res) => {
  const cp = new Coupon(req.body);

  cp.save()
    .then(data => {
      res.send({
        success: true,
        data
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the coupon."
      });
    });
};

exports.findAll = (req, res) => {
  Coupon
    .find()
    //.where('validity').gte(new Date())
    .then(coupons => {
      return res.send({
        success: true,
        data: coupons
      });
    });
};

exports.update = (req, res) => {

  Coupon.findByIdAndUpdate(req.params.couponId, req.body, {
      new: true
    })
    .then(coupon => {
      if (!coupon) {
        return res.status(404).send({
          message: "coupon not found with id " + req.params.couponId
        });
      }
      res.send({
        success: true,
        data: coupon
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "coupon not found with id " + req.params.couponId
        });
      }
      return res.status(500).send({
        message: "Error updating coupon with id " + req.params.couponId
      });
    });
};
