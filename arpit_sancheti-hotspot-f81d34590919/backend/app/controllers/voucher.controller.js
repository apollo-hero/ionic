/*jshint esversion: 6 */
const Voucher = require('../models/voucher.model.js');
const http = require('http');
const twilio = require('../provider/twilio');
const fcm = require('../provider/notification');

// Create and Save a new voucher
exports.create = (req, res) => {
  const voucher = new Voucher(req.body);
  voucher.save()
    .then(data => {
      res.send({
        success: true,
        data: data
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the voucher."
      });
    });
};

exports.createOnSpotipo = (req, res) => {
  var token = '2bdc73c7-6614-4297-9bf4-1b03fee7c323';
  var jsonData = JSON.stringify(req.body);
  var options = {
    host: '34.231.13.93',
    path: '/s/1/api/voucher/create/',
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(jsonData),
      "Authentication-Token": token
    }
  };
  var request = http.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (data) {
      data = JSON.parse(data);
      console.log('BODY: ', data);
      res.send({
        success: true,
        data: data.data
      });
    });
  });

  request.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  request.write(jsonData);
  //request.write('data\n');
  request.end();
};

// Retrieve and return all vouchers from the database.
exports.findAll = (req, res) => {
  Voucher.find()
    .sort({
      'createdAt': -1
    })
    .limit(100)
    .populate('_creator')
    .populate('_user')
    .then(vouchers => {
      res.send({
        success: true,
        data: vouchers
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving vouchers."
      });
    });
};

exports.findByUsers = (req, res) => {
  Voucher.find({
      _user: req.params.userId
    })
    .sort({
      'createdAt': -1
    })
    .populate('_creator')
    .populate('_user')
    .then(vouchers => {
      res.send({
        success: true,
        data: vouchers
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving vouchers."
      });
    });
};

exports.findByVendors = (req, res) => {
  Voucher.find({
      _creator: req.params.userId
    })
    .sort({
      'createdAt': -1
    })
    .populate('_creator')
    .populate('_user')
    .then(vouchers => {
      res.send({
        success: true,
        data: vouchers
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving vouchers."
      });
    });
};

// Find a single voucher with a voucherId
exports.findOne = (req, res) => {
  Voucher.findById(req.params.voucherId)
    .then(voucher => {
      if (!voucher) {
        return res.status(404).send({
          message: "voucher not found with id " + req.params.voucherId
        });
      }
      res.send({
        success: true,
        data: voucher
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "voucher not found with id " + req.params.voucherId
        });
      }
      return res.status(500).send({
        message: "Error retrieving voucher with id " + req.params.voucherId
      });
    });
};

// Update a voucher identified by the voucherId in the request
exports.update = (req, res) => {
  res.status(400).send({
    message: "Method not allowed, Invalid Request"
  });
};

exports.transfer = (req, res) => {
  Voucher.findOne({
    id: req.params.voucherId
  }).then(voucher => {
    voucher._user = req.body.userId;
    voucher._mobile = req.body.mobile;
    const {
      price,
      duration_val
    } = voucher._plan;
    const to = '+1' + voucher._mobile.toString();
    const msg = 'New plan of price ' + price + ' with validity of ' + duration_val + ' days added with voucher number ' + req.params.voucherId + '. To activate go to http: //scan2log.in/?voucher=' + req.params.voucherId;
    twilio.sendMessage(to, msg);
    fcm.sendNotification(voucher._user.token, voucher._plan);
    return Voucher.update({
      id: voucher.id
    }, voucher);
  }).then(voucher => {
    return res.send({
      success: true,
      data: voucher
    });
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "voucher not found with id " + req.params.voucherId
      });
    }
    return res.status(500).send({
      message: "Error retrieving voucher with id " + req.params.voucherId
    });
  });
};

// Delete a voucher with the specified voucherId in the request
exports.delete = (req, res) => {
  res.status(400).send({
    message: "Method not allowed, Invalid Request"
  });
};
