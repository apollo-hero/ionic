const vouchers = require('../controllers/voucher.controller.js');
module.exports = (app) => {

  app.get('/voucher/user/:userId', vouchers.findByUsers);

  app.get('/voucher/vendor/:userId', vouchers.findByVendors);

  app.post('/voucher/create', vouchers.createOnSpotipo);

  // Create a new Note
  app.post('/voucher', vouchers.create);

  // Retrieve all vouchers
  app.get('/voucher', vouchers.findAll);

  app.put('/voucher/transfer/:voucherId', vouchers.transfer);

  // Retrieve a single Note with noteId
  app.get('/voucher/:voucherId', vouchers.findOne);

  // Update a Note with noteId
  app.put('/voucher/:voucherId', vouchers.update);

  // Delete a voucher with voucherId
  app.delete('/voucher/:voucherId', vouchers.delete);
}
