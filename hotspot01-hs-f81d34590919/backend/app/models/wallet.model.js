const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  isCredit: {
    type: Boolean,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  _id: false,
  timestamps: true
});

const WalletSchema = mongoose.Schema({
  balance: {
    type: Number,
  },
  transactions: {
    type: [TransactionSchema]
  }
}, {
  timestamps: true
});

WalletSchema.pre('save', function (next) {
  if (!this.balance) this.balance = 0;
  next();
});

module.exports = mongoose.model('Wallet', WalletSchema);
