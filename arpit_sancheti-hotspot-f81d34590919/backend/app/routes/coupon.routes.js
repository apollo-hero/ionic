// jshint esversion: 6
const coupons = require('../controllers/coupon.controller.js');
module.exports = (app) => {

  // Create a new Coupon
  app.post('/coupons', coupons.addCoupon);

  app.put('/coupons/:couponId', coupons.update);

  // Get Transactional couponCode
  app.get('/coupons/trans/:couponCode', coupons.findTransactional);

  // get wallet couponCode
  app.get('/coupons/wallet/:couponCode', coupons.findWallet);

  app.get('/coupons', coupons.findAll);

};
