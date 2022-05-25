// jshint esversion: 6
const Wallet = require('../models/wallet.model');


exports.findOne = (req, res) => {
  Wallet.findById(req.params.walletId)
    .then(wallet => {
      if (!wallet) {
        return res.status(404).send({
          message: "wallet not found with id " + req.params.walletId
        });
      }
      res.send({
        success: true,
        data: wallet.balance
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "wallet not found with id " + req.params.walletId
        });
      }
      return res.status(500).send({
        message: "Error retrieving wallet with id " + req.params.walletId
      });
    });
};

exports.getTransactions = (req, res) => {
  Wallet.findById(req.params.walletId)
    .then(wallet => {
      if (!wallet) {
        return res.status(404).send({
          message: "wallet not found with id " + req.params.walletId
        });
      }
      res.send({
        success: true,
        data: wallet.transactions
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "wallet not found with id " + req.params.walletId
        });
      }
      return res.status(500).send({
        message: "Error retrieving wallet with id " + req.params.walletId
      });
    });
};

exports.addTransaction = (req, res) => {
  Wallet.findById(req.params.walletId).then(wallet => {
    if (!wallet) {
      return res.status(404).send({
        message: "wallet not found with id " + req.params.walletId
      });
    }
    wallet.balance = wallet.balance - req.body.amount;
    req.body.createdOn = new Date();
    wallet.transactions.push(req.body);
    Wallet.findByIdAndUpdate(req.params.walletId, wallet).then(wallet => res.send({
      success: true,
      data: wallet.transactions
    }));
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "wallet not found with id " + req.params.walletId
      });
    }
    return res.status(500).send({
      message: "Error retrieving wallet with id " + req.params.walletId
    });
  });
};

exports.transfer = (req, res) => {
  const {
    payee,
    payer,
    amount
  } = req.body;
  req.body.createdOn = new Date();
  Wallet.findById(payee).then(payeeWallet => {
    if (!payeeWallet) {
      return res.status(404).send({
        message: "Payee Wallet Not Found"
      });
    }
    payeeWallet.balance = payeeWallet.balance + amount;
    req.body.add = true;
    payeeWallet.transactions.push(req.body);
    return Wallet.findByIdAndUpdate(payee, payeeWallet);
  }).then(a => {
    return Wallet.findById(payer);
  }).then(payerWallet => {
    if (!payerWallet) {
      return res.status(404).send({
        message: "Payer Wallet Not Found"
      });
    }
    payerWallet.balance = payerWallet.balance - amount;
    req.body.add = false;
    payerWallet.transactions.push(req.body);
    return Wallet.findByIdAndUpdate(payer, payerWallet);
  }).then(wallet => res.send({
    success: true
  }));
};
