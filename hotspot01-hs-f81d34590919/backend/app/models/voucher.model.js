/*jshint esversion: 6 */

const mongoose = require('mongoose');
const User = require('./user.model');
const Wallet = require('./wallet.model');
const twilio = require('../provider/twilio');
const fcm = require('../provider/notification');


const VoucherSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  _plan: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  _mobile: {
    type: Number
  },
  discount: {
    type: Number
  }
}, {
  timestamps: true
});

VoucherSchema.post('save', function (doc) {
  var _creator = doc._creator;
  var _id = doc._id;
  var _plan = doc._plan;
  var voucherId = doc.id;
  var mobile = doc._mobile;
  const {
    price,
    duration_val
  } = _plan;
  const message = 'New plan of price ' + price + ' with validity of ' + duration_val + ' days has been added on your number. To activate go to http: //scan2log.in/?voucher=' + voucherId;
  if (mobile) {
    twilio.sendMessage('+1' + mobile.toString(), message);
  } else if (doc._user) {
    User.findById(doc._user).then(user => {
      if (!mobile) {
        twilio.sendMessage('+1' + user.mobile.toString(), message);
      }
      fcm.sendNotification(user.token, _plan);
    });
  }
  User.findById(_creator).then(user => {
    user.vouchers.push(_id);
    if (!doc._user && !mobile) {
      twilio.sendMessage('+1' + user.mobile.toString(), message);
      fcm.sendNotification(user.token, _plan);
    }
    let a = _plan.price - doc.discount;
    User.findByIdAndUpdate(_creator, user).then(() => console.log('User Updated'));
    Wallet.findById(user.wallet).then(wallet => {
      wallet.balance = wallet.balance - a;
      wallet.transactions.push({
        amount: a,
        isCredit: false,
        details: doc
      });
      Wallet.findByIdAndUpdate(user.wallet, wallet).then(wallet => console.log('Wallet Updated'));
    });
  });
});

module.exports = mongoose.model('Voucher', VoucherSchema);
