const mongoose = require('mongoose');
const Wallet = require('./wallet.model');
const UsersSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  sex: {
    type: String
  },
  mobile: {
    type: Number,
    required: [true, 'Mobile Number is required'],
    get: v => Math.round(v),
    set: v => Math.round(v),
    unique: [true, 'User with this mobile number already exist']
  },
  age: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  userName: {
    type: String,
    index: true,
    unique: [true, 'A user with this userName exist'],
    required: [true, 'userName/ email is required']
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  location: {
    type: String
  },
  isActive: {
    type: Boolean,
    required: true
  },
  vouchers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Voucher'
  },
  type: {
    type: Number,
    min: 1,
    max: 3,
    get: v => Math.floor(v),
    set: v => Math.floor(v),
    required: true
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  commision: {
    type: Number,
    required: true
  },
  token: {
    type: String
  },
  picture: {
    type: String
  }
}, {
  timestamps: true
});

UsersSchema.pre('validate', function (next) {
  if (!this.userName) this.userName = this.name.split(" ").join('');
  if (!this.password) this.password = '123456';
  if (!this.commision) this.commision = 0;
  if (!this.type) this.type = 2;
  if (!this.wallet) {
    const wallet = new Wallet();
    wallet.save().then(wallet => {
      this.wallet = wallet._id;
      next();
    });
  }
});

module.exports = mongoose.model('Users', UsersSchema);
