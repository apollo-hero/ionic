// jshint esversion: 6
const wallet = require('../controllers/wallet.controller.js');
module.exports = (app) => {
  // Retrieve all wallet
  app.get('/wallet/:walletId', wallet.findOne);

  // Retrieve a single Note with noteId
  app.get('/transaction/:walletId', wallet.getTransactions);
  app.put('/transaction/:walletId', wallet.addTransaction);

  //wallet to wallet transfer
  app.put('/wallet/transfer', wallet.transfer);
};
